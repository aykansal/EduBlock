import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { ApiError, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
    try {
        // Get all users with their video progress
        const users = await prisma.user.findMany({
            select: {
                walletId: true,
                username: true,
                videoProgress: {
                    select: {
                        progress: true,
                        completed: true,
                        lastWatched: true
                    }
                }
            },
            orderBy: {
                username: 'asc' // Default ordering
            }
        });

        // Calculate watch time and token metrics for each user
        const leaderboardUsers = users.map(user => {
            // Sum up total watch time (converting progress percentage to minutes, assuming avg 10 min videos)
            const totalMinutes = user.videoProgress.reduce((sum, progress) => {
                // Each video is assumed to be ~10 minutes, and progress is a percentage
                const watchedMinutes = 10 * (progress.progress / 100);
                return sum + watchedMinutes;
            }, 0);

            // Calculate completed videos
            const completedVideos = user.videoProgress.filter(p => p.completed).length;
            
            // Generate a token amount based on completed videos and watch time (simplified formula)
            const tokens = Math.floor(completedVideos * 10 + totalMinutes / 5);

            // Generate an avatar URL from the username
            const avatar = `https://api.dicebear.com/6.x/adventurer/svg?seed=${user.username}`;

            return {
                id: user.walletId,
                name: user.username,
                avatar,
                watchTime: Math.floor(totalMinutes),
                tokens
            };
        });

        // Sort by tokens in descending order (highest first)
        leaderboardUsers.sort((a, b) => b.tokens - a.tokens);

        return NextResponse.json({ 
            users: leaderboardUsers
        });

    } catch (error: any) {
        console.error('Error fetching leaderboard data:', error);
        const { error: errorMessage, status } = handleApiError(error);
        return NextResponse.json(
            { message: 'Error fetching leaderboard data', details: errorMessage },
            { status }
        );
    }
}
