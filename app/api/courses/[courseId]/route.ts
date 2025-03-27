import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ courseId: string }> } 
) {
    try {
        const resolvedParams = await params;

        if (!resolvedParams || !resolvedParams.courseId) {
            return NextResponse.json({ error: 'Course ID is missing' }, { status: 400 });
        }

        const courseId = parseInt(resolvedParams.courseId);
        
        if (isNaN(courseId)) {
            return NextResponse.json(
                { message: 'Invalid course ID' },
                { status: 400 }
            );
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                videos: {
                    orderBy: {
                        position: 'asc'
                    }
                }
            }
        });

        if (!course) {
            return NextResponse.json(
                { message: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ course });

    } catch (error: any) {
        console.error('Error fetching course:', error);
        return NextResponse.json(
            {
                message: 'Internal server error',
                details: error.message
            },
            { status: 500 }
        );
    }
} 