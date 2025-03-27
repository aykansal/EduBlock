import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { ApiError, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const walletId = searchParams.get('walletId');

        if (!walletId) {
            return NextResponse.json(
                { message: 'Wallet ID is required' },
                { status: 400 }
            );
        }

        // Get user's courses and their progress
        const userCourses = await prisma.course.findMany({
            where: { 
                userId: walletId 
            },
            include: {
                videos: {
                    orderBy: {
                        position: 'asc'
                    }
                },
                videoProgress: {
                    where: {
                        userId: walletId
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        // Calculate user's settings for daily target
        const user = await prisma.user.findUnique({
            where: { walletId }
        });

        // Default session settings if not found
        const dailyTarget = {
            sessionsCompleted: 0,
            totalSessions: 4,
            sessionDuration: 40,
            breakDuration: 5
        };

        if (user) {
            // Count completed sessions today (sessions being completed videos)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const completedToday = await prisma.videoProgress.count({
                where: {
                    userId: walletId,
                    completed: true,
                    lastWatched: {
                        gte: today
                    }
                }
            });
            
            dailyTarget.sessionsCompleted = completedToday;
        }

        // Format courses into playlists
        const formatCourse = (course: any, videosCompleted: number) => ({
            id: course.id.toString(),
            title: course.title,
            thumbnailUrl: course.videos[0]?.thumbnail || 'https://picsum.photos/seed/course/300/200',
            totalVideos: course.videos.length,
            completedVideos: videosCompleted
        });

        // Find current playlist (most recently watched)
        let currentPlaylist = null;
        let completedPlaylists = [];
        let recommendedPlaylists = [];

        // Process each course
        for (const course of userCourses) {
            // Count completed videos
            const completedVideos = course.videoProgress.filter(p => p.completed).length;
            const isCompleted = completedVideos === course.videos.length && course.videos.length > 0;
            const formattedCourse = formatCourse(course, completedVideos);

            // If all videos are completed, add to completed playlists
            if (isCompleted) {
                completedPlaylists.push(formattedCourse);
            } 
            // If some videos are completed but not all, it's the current playlist
            else if (completedVideos > 0 && !currentPlaylist) {
                currentPlaylist = formattedCourse;
            }
            // If no videos completed, it's recommended
            else if (completedVideos === 0) {
                recommendedPlaylists.push(formattedCourse);
            }
            // If we have a current playlist but this has videos completed too
            else if (completedVideos > 0) {
                recommendedPlaylists.push(formattedCourse);
            }
        }

        // If there are no current playlists but there are recommended ones,
        // make the first recommended the current one
        if (!currentPlaylist && recommendedPlaylists.length > 0) {
            currentPlaylist = recommendedPlaylists.shift();
        }

        return NextResponse.json({
            currentPlaylist,
            completedPlaylists,
            recommendedPlaylists,
            dailyTarget
        });

    } catch (error: any) {
        console.error('Error fetching progress data:', error);
        const { error: errorMessage, status } = handleApiError(error);
        return NextResponse.json(
            { message: 'Error fetching progress data', details: errorMessage },
            { status }
        );
    }
}
