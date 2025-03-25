import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

interface Thumbnails {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
    standard: { url: string; width: number; height: number };
    maxres: { url: string; width: number; height: number };
}

interface Snippet {
    publishedAt: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    position: number;
}

interface ContentDetails {
    videoId: string;
    videoPublishedAt: string;
}

interface Item {
    kind: string;
    etag: string;
    id: string;
    snippet: Snippet;
    contentDetails: ContentDetails;
}

interface PlaylistItemListResponse {
    kind: string;
    etag: string;
    nextPageToken: string;
    items: Item[];
    pageInfo: { totalResults: number; resultsPerPage: number };
}

interface Video {
    title: string;
    position: number;
    videoId: string;
    thumbnail: string;
    publishedAt: string;
    channelTitle: string;
}

export async function GET(request: NextRequest) {
    const playlistId = request.nextUrl.searchParams.get('playlistId');

    if (!playlistId || typeof playlistId !== 'string') {
        return NextResponse.json({ message: 'Playlist ID is required' }, { status: 400 });
    }

    try {
        let nextPageToken: string = "";
        let allItems: Item[] = [];

        do {
            const response = await axios.get<PlaylistItemListResponse>('https://www.googleapis.com/youtube/v3/playlistItems', {
                params: {
                    playlistId,
                    pageToken: nextPageToken,
                    part: 'snippet,contentDetails',
                    key: process.env.NEXT_YOUTUBE_API_KEY,
                },
            });

            allItems = [...allItems, ...response.data.items];
            nextPageToken = response.data.nextPageToken;
        } while (nextPageToken);

        const videos: Video[] = allItems.map(item => ({
            title: item.snippet.title,
            position: item.snippet.position,
            videoId: item.contentDetails.videoId,
            publishedAt: item.snippet.publishedAt,
            channelTitle: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.default.url,
        }));

        return NextResponse.json({
            videosCount: videos.length,
            videos,
        });

    } catch (error: any) {
        console.error('YouTube API Error:', error.message);
        return NextResponse.json({ message: 'Error fetching playlist data' }, { status: 500 });
    }
}
