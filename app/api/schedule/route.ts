import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { ApiError, handleApiError } from '@/lib/api-utils';

// Get scheduled lectures for a user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const walletId = searchParams.get('walletId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!walletId) {
            return NextResponse.json(
                { message: 'Wallet ID is required' },
                { status: 400 }
            );
        }

        // Default to the next 7 days if no date range is provided
        const queryStartDate = startDate ? new Date(startDate) : new Date();
        let queryEndDate;

        if (endDate) {
            queryEndDate = new Date(endDate);
        } else {
            queryEndDate = new Date(queryStartDate);
            queryEndDate.setDate(queryEndDate.getDate() + 7); // Next 7 days
        }

        // Find all scheduled lectures for this user within the date range
        const scheduledLectures = await prisma.scheduledLecture.findMany({
            where: {
                userId: walletId,
                date: {
                    gte: queryStartDate,
                    lte: queryEndDate
                }
            },
            include: {
                video: true,
                course: true
            },
            orderBy: {
                date: 'asc'
            }
        });

        // Format the response
        const formattedLectures = scheduledLectures.map(lecture => {
            // Calculate the duration in hours:minutes format
            const hours = Math.floor(lecture.duration / 60);
            const minutes = lecture.duration % 60;
            const durationString = hours > 0 
                ? `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} min` : ''}`
                : `${minutes} minutes`;

            return {
                id: lecture.id,
                title: lecture.title || lecture.video.title,
                videoId: lecture.videoId,
                courseId: lecture.courseId,
                courseTitle: lecture.course.title,
                date: lecture.date.toISOString(),
                formattedDate: formatDateForDisplay(lecture.date),
                duration: durationString,
                durationMinutes: lecture.duration
            };
        });

        return NextResponse.json({
            scheduledLectures: formattedLectures
        });
    } catch (error: any) {
        console.error('Error fetching scheduled lectures:', error);
        const { error: errorMessage, status } = handleApiError(error);
        return NextResponse.json(
            { message: 'Error fetching scheduled lectures', details: errorMessage },
            { status }
        );
    }
}

// Create a scheduled lecture
export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const walletId = searchParams.get('walletId');

        if (!walletId) {
            return NextResponse.json(
                { message: 'Wallet ID is required' },
                { status: 400 }
            );
        }

        const data = await request.json();
        
        // Validate required fields
        if (!data.videoId || !data.courseId || !data.date) {
            return NextResponse.json(
                { message: 'VideoId, courseId, and date are required' },
                { status: 400 }
            );
        }

        // First, let's verify that the video exists
        const video = await prisma.video.findUnique({
            where: {
                videoId: data.videoId
            },
            include: {
                playlist: true
            }
        });

        if (!video) {
            return NextResponse.json(
                { message: 'Video not found' },
                { status: 404 }
            );
        }

        // Then check if it belongs to the specified course
        if (video.playlist.id !== parseInt(data.courseId)) {
            return NextResponse.json(
                { message: 'Video does not belong to the specified course' },
                { status: 400 }
            );
        }
        
        const courseId = parseInt(data.courseId);
        const duration = data.duration || 60;

        // Create the scheduled lecture
        const scheduledLecture = await prisma.scheduledLecture.create({
            data: {
                userId: walletId,
                videoId: data.videoId,
                courseId: courseId,
                date: new Date(data.date),
                duration: duration,
                title: data.title
            },
            include: {
                video: true,
                course: true
            }
        });

        // Format the response
        const hours = Math.floor(scheduledLecture.duration / 60);
        const minutes = scheduledLecture.duration % 60;
        const durationString = hours > 0 
            ? `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} min` : ''}`
            : `${minutes} minutes`;

        return NextResponse.json({
            message: 'Lecture scheduled successfully',
            scheduledLecture: {
                id: scheduledLecture.id,
                title: scheduledLecture.title || scheduledLecture.video.title,
                videoId: scheduledLecture.videoId,
                courseId: scheduledLecture.courseId,
                courseTitle: scheduledLecture.course.title,
                date: scheduledLecture.date.toISOString(),
                formattedDate: formatDateForDisplay(scheduledLecture.date),
                duration: durationString,
                durationMinutes: scheduledLecture.duration
            }
        });
    } catch (error: any) {
        console.error('Error creating scheduled lecture:', error);
        const { error: errorMessage, status } = handleApiError(error);
        return NextResponse.json(
            { message: 'Error creating scheduled lecture', details: errorMessage },
            { status }
        );
    }
}

// Delete a scheduled lecture
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const lectureId = searchParams.get('lectureId');
        const walletId = searchParams.get('walletId');

        if (!lectureId || !walletId) {
            return NextResponse.json(
                { message: 'Lecture ID and Wallet ID are required' },
                { status: 400 }
            );
        }

        // Check if the lecture exists and belongs to the user
        const lecture = await prisma.scheduledLecture.findFirst({
            where: {
                id: parseInt(lectureId),
                userId: walletId
            }
        });

        if (!lecture) {
            return NextResponse.json(
                { message: 'Scheduled lecture not found or does not belong to the user' },
                { status: 404 }
            );
        }

        // Delete the lecture
        await prisma.scheduledLecture.delete({
            where: {
                id: parseInt(lectureId)
            }
        });

        return NextResponse.json({
            message: 'Scheduled lecture deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting scheduled lecture:', error);
        const { error: errorMessage, status } = handleApiError(error);
        return NextResponse.json(
            { message: 'Error deleting scheduled lecture', details: errorMessage },
            { status }
        );
    }
}

// Helper function to format dates for display
function formatDateForDisplay(date: Date): string {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
        return `Today, ${formatTime(date)}`;
    }
    
    // Check if it's tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
        return `Tomorrow, ${formatTime(date)}`;
    }
    
    // Otherwise, show the full date
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[date.getDay()];
    return `${dayName}, ${formatTime(date)}`;
}

// Helper function to format time (12-hour format with AM/PM)
function formatTime(date: Date): string {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${hours}:${minutesStr} ${ampm}`;
}
