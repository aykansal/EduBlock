import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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

        const courses = await prisma.course.findMany({
            where: {
                userId: walletId
            },
            include: {
                videos: {
                    orderBy: {
                        position: 'asc'
                    },
                    // take: 1 // Only get the first video for the thumbnail
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ courses });

    } catch (error: any) {
        console.error('Error fetching courses:', error);
        return NextResponse.json(
            { 
                message: 'Internal server error',
                details: error.message
            },
            { status: 500 }
        );
    }
}
