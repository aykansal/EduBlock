import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { ApiError, handleApiError } from '@/lib/api-utils';

// Get user dashboard data
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

        // Fetch user
        const user = await prisma.user.findUnique({
            where: { walletId },
        });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Fetch current active course and progress
        const activeCourse = user.activeCourseId 
            ? await prisma.course.findUnique({
                where: { id: user.activeCourseId },
                include: { videos: { orderBy: { position: 'asc' } } }
              })
            : null;

        // If no active course is set, get the most recently watched course
        let currentCourse = activeCourse;
        let courseProgress = 0;

        if (!currentCourse) {
            // Get the most recently watched video
            const latestProgress = await prisma.videoProgress.findFirst({
                where: { userId: walletId },
                orderBy: { lastWatched: 'desc' },
                include: { course: true }
            });

            if (latestProgress) {
                currentCourse = await prisma.course.findUnique({
                    where: { id: latestProgress.courseId },
                    include: { videos: { orderBy: { position: 'asc' } } }
                });
            }
        }

        // Calculate course progress if we have a current course
        if (currentCourse) {
            const videoIds = currentCourse.videos.map(video => video.videoId);
            
            // Count completed videos
            const completedVideos = await prisma.videoProgress.count({
                where: {
                    userId: walletId,
                    videoId: { in: videoIds },
                    completed: true
                }
            });
            
            courseProgress = currentCourse.videos.length > 0 
                ? Math.round((completedVideos / currentCourse.videos.length) * 100) 
                : 0;
        }

        // Fetch recent activity (video completions, course enrollments)
        const recentProgress = await prisma.videoProgress.findMany({
            where: { userId: walletId },
            orderBy: { lastWatched: 'desc' },
            take: 5,
            include: { 
                video: true,
                course: true
            }
        });

        // Transform to activity format
        const recentActivity = recentProgress.map(progress => {
            let activityType = progress.completed ? 'completion' : 'progress';
            let title = progress.completed 
                ? `Completed: ${progress.video.title}` 
                : `Watched: ${progress.video.title}`;
            
            // Calculate relative time
            const now = new Date();
            const lastWatched = new Date(progress.lastWatched);
            const diffMs = now.getTime() - lastWatched.getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffHours / 24);
            
            let date;
            if (diffHours < 1) {
                date = 'Just now';
            } else if (diffHours < 24) {
                date = `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
            } else {
                date = `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
            }
            
            return {
                id: progress.id,
                title,
                type: activityType,
                date,
                courseTitle: progress.course.title
            };
        });

        // Fetch user's courses for upcoming lectures
        const userCourses = await prisma.course.findMany({
            where: { userId: walletId },
            include: {
                videos: {
                    orderBy: { position: 'asc' },
                    take: 5
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        // Get scheduled lectures for next 7 days
        const now = new Date();
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);

        const scheduledLectures = await prisma.scheduledLecture.findMany({
            where: {
                userId: walletId,
                date: {
                    gte: now,
                    lte: nextWeek
                }
            },
            include: {
                video: true,
                course: true
            },
            orderBy: {
                date: 'asc'
            },
            take: 5
        });

        // Format scheduled lectures for display
        const upcomingLectures = scheduledLectures.map(lecture => {
            // Format date for display
            const lectureDate = new Date(lecture.date);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            
            // Format the date as Today, Tomorrow, or day of week
            let formattedDate;
            if (lectureDate.toDateString() === today.toDateString()) {
                formattedDate = 'Today';
            } else if (lectureDate.toDateString() === tomorrow.toDateString()) {
                formattedDate = 'Tomorrow';
            } else {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const dayName = days[lectureDate.getDay()];
                formattedDate = dayName;
            }
            
            // Add time to date
            const hours = lectureDate.getHours();
            const minutes = lectureDate.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hour12 = hours % 12 || 12;
            const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
            formattedDate += `, ${hour12}:${minutesStr} ${ampm}`;
            
            // Format duration
            const hours_duration = Math.floor(lecture.duration / 60);
            const minutes_duration = lecture.duration % 60;
            const durationStr = hours_duration > 0 
                ? `${hours_duration} hour${hours_duration > 1 ? 's' : ''}${minutes_duration > 0 ? ` ${minutes_duration} min` : ''}`
                : `${minutes_duration} minutes`;
            
            return {
                id: lecture.id,
                title: lecture.title || lecture.video.title,
                courseTitle: lecture.course.title,
                date: formattedDate,
                duration: durationStr
            };
        });

        // If no scheduled lectures, add suggested ones based on uncompleted videos
        if (upcomingLectures.length === 0 && userCourses.length > 0) {
            // Create suggested upcoming lectures from uncompleted videos
            const suggestedLectures = [];
            
            for (const course of userCourses) {
                for (const video of course.videos) {
                    // Check if this video is completed
                    const videoProgress = await prisma.videoProgress.findUnique({
                        where: {
                            userId_videoId: {
                                userId: walletId,
                                videoId: video.videoId
                            }
                        }
                    });
                    
                    // If not completed, add to suggested lectures
                    if (!videoProgress || !videoProgress.completed) {
                        // Generate date based on video position
                        const today = new Date();
                        const futureDate = new Date(today);
                        futureDate.setDate(today.getDate() + video.position % 5); // Spread over next 5 days
                        
                        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        const dayName = days[futureDate.getDay()];
                        
                        // Generate a random time
                        const hours = 9 + Math.floor(Math.random() * 8); // 9 AM to 5 PM
                        const ampm = hours >= 12 ? 'PM' : 'AM';
                        const hour12 = hours % 12 || 12;
                        
                        suggestedLectures.push({
                            id: video.id,
                            title: video.title,
                            courseTitle: course.title,
                            date: video.position === 0 ? 'Today' : 
                                   video.position === 1 ? 'Tomorrow' : 
                                   `${dayName}, ${hour12}:00 ${ampm}`,
                            duration: '1 hour',  // Default duration
                            suggested: true
                        });
                        
                        // Only add up to 5 suggested lectures
                        if (suggestedLectures.length >= 5) break;
                    }
                }
                
                if (suggestedLectures.length >= 5) break;
            }
            
            // Add suggested lectures to upcoming lectures array
            upcomingLectures.push(...suggestedLectures);
        }

        // Get total token balance (placeholder - this would be replaced with actual token logic)
        const tokenBalance = 250;
        const weeklyTokens = 50;

        return NextResponse.json({
            currentCourse: currentCourse ? {
                id: currentCourse.id,
                title: currentCourse.title,
                progress: courseProgress
            } : null,
            tokenBalance,
            weeklyTokens,
            nextMilestone: {
                tokens: 75,
                description: "Complete 5 more lectures"
            },
            focusScore: {
                score: 92,
                percentile: 5
            },
            recentActivity,
            upcomingLectures,
            courses: userCourses.map(course => ({
                id: course.id,
                title: course.title,
                createdAt: course.createdAt,
                videoCount: course.videoCount
            }))
        });

    } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        const { error: errorMessage, status } = handleApiError(error);
        return NextResponse.json(
            { message: 'Error fetching dashboard data', details: errorMessage },
            { status }
        );
    }
}
