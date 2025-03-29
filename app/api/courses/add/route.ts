import { prisma } from '@/lib/prisma';
import { Item, PlaylistItemListResponse } from '@/types/courses';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

interface RequestBody {
    playlistId: string;
    walletId: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: RequestBody = await request.json();
        const { playlistId, walletId } = body;

        // Validate request body
        if (!playlistId || typeof playlistId !== 'string') {
            return NextResponse.json(
                { message: 'Playlist ID is required' },
                { status: 400 }
            );
        }

        if (!walletId || typeof walletId !== 'string') {
            return NextResponse.json(
                { message: 'Wallet ID is required' },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { walletId }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Check if course already exists
        const existingCourse = await prisma.course.findUnique({
            where: {
                playlistId: playlistId,
                userId: walletId,
            },
            include: {
                videos: true
            }
        });

        if (existingCourse) {
            return NextResponse.json(
                {
                    message: 'Course already exists',
                    courseId: existingCourse.id,
                    videos: existingCourse.videos
                },
                { status: 200 }
            );
        }

        // Fetch playlist items
        let nextPageToken: string = "";
        let allItems: Item[] = [];

        do {
            const response = await axios.get<PlaylistItemListResponse>(
                'https://www.googleapis.com/youtube/v3/playlistItems',
                {
                    params: {
                        playlistId,
                        pageToken: nextPageToken,
                        part: 'snippet',
                        key: process.env.NEXT_YOUTUBE_API_KEY,
                    },
                }
            );

            if (!response.data || !response.data.items) {
                throw new Error('Invalid response from YouTube API');
            }

            allItems = [...allItems, ...response.data.items];
            nextPageToken = response.data.nextPageToken || "";
        } while (nextPageToken);

        if (allItems.length === 0) {
            return NextResponse.json(
                { message: 'No videos found in the playlist' },
                { status: 400 }
            );
        }

        const videos = allItems.map(item => ({
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.standard.url,
            position: item.snippet.position,
            channelTitle: item.snippet.channelTitle,
            channelId: item.snippet.channelId,
        }));

        // Create course with first video's title
        const newCourse = await prisma.course.create({
            data: {
                playlistId: playlistId,
                title: videos[0].title,
                videos: {
                    create: videos,
                },
                videoCount: videos.length,
                userId: walletId
            },
            include: {
                videos: true
            }
        });

        return NextResponse.json({
            message: 'Course created successfully',
            courseId: newCourse.id,
            videosCount: videos.length,
            videos: newCourse.videos,
        }, {
            status: 201
        });

    } catch (error: any) {
        // Log the error with proper error object
        console.error('Error in course creation:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });

        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.error?.message || error.message;
            return NextResponse.json(
                {
                    message: 'Error fetching playlist data',
                    details: errorMessage
                },
                { status: error.response?.status || 500 }
            );
        }

        // Handle Prisma errors
        if (error.code && error.code.startsWith('P')) {
            return NextResponse.json(
                {
                    message: 'Database error',
                    details: error.message
                },
                { status: 500 }
            );
        }

        // Handle other errors
        return NextResponse.json(
            {
                message: 'Internal server error',
                details: error.message || 'An unexpected error occurred'
            },
            { status: 500 }
        );
    }
}
