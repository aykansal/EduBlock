import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export default async function Get(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('userId');
    const enrolledCourses = await prisma.course.findMany({
        where: {
            userId
        }
    });

    return NextResponse.json({ courses: enrolledCourses });
}
