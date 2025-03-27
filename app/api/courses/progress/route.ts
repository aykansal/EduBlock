import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Save user watch progress
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { walletId, courseId, videoId, progress, completed } = body;

        if (!walletId || !courseId || !videoId) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if progress record exists
        const existingProgress = await prisma.videoProgress.findUnique({
            where: {
                userId_videoId: {
                    userId: walletId,
                    videoId: videoId
                }
            }
        });

        if (existingProgress) {
            // Only update if new progress is greater than existing progress
            if (progress > existingProgress.progress) {
                const updatedProgress = await prisma.videoProgress.update({
                    where: {
                        userId_videoId: {
                            userId: walletId,
                            videoId: videoId
                        }
                    },
                    data: {
                        progress,
                        completed: completed || existingProgress.completed,
                        lastWatched: new Date()
                    }
                });

                return NextResponse.json({ progress: updatedProgress });
            } else {
                // Return existing progress without updating
                return NextResponse.json({ progress: existingProgress });
            }
        } else {
            // Create new progress entry
            const newProgress = await prisma.videoProgress.create({
                data: {
                    userId: walletId,
                    videoId,
                    courseId: parseInt(courseId.toString()),
                    progress,
                    completed: completed || false,
                    lastWatched: new Date()
                }
            });

            return NextResponse.json({ progress: newProgress });
        }
    } catch (error: any) {
        console.error('Error saving progress:', error);
        return NextResponse.json(
            { message: 'Error saving progress', details: error.message },
            { status: 500 }
        );
    }
}

// Get user progress for a course
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const walletId = searchParams.get('walletId');
        const courseId = searchParams.get('courseId');

        if (!walletId || !courseId) {
            return NextResponse.json(
                { message: 'Missing required parameters' },
                { status: 400 }
            );
        }

        const progress = await prisma.videoProgress.findMany({
            where: {
                userId: walletId,
                courseId: parseInt(courseId)
            },
            orderBy: {
                lastWatched: 'desc'
            }
        });

        // Get the last watched video
        const lastWatchedVideo = progress.length > 0 
            ? progress.reduce((prev, current) => 
                (prev.lastWatched > current.lastWatched) ? prev : current
            ) 
            : null;

        return NextResponse.json({ 
            progress, 
            lastWatchedVideo: lastWatchedVideo?.videoId 
        });
    } catch (error: any) {
        console.error('Error fetching progress:', error);
        return NextResponse.json(
            { message: 'Error fetching progress', details: error.message },
            { status: 500 }
        );
    }
} 