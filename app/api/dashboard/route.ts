import { NextResponse } from "next/server";
import { Reward, ActivityLog } from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface ActivityData {
  rewardAmount?: number;
  status?: string;
}

interface UserWithRelations {
  enrolledCourses: Array<{
    course: {
      title: string;
    };
    progress: number;
  }>;
  activityLogs: Array<ActivityLog & { data: ActivityData | null }>;
  rewards: Reward[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get("walletId");

    if (!walletId) {
      return NextResponse.json(
        { error: "Wallet ID is required" },
        { status: 400 }
      );
    }

    // Get user data with all necessary relations
    const user = await prisma.user.findUnique({
      where: { walletId },
      include: {
        enrolledCourses: {
          where: { status: "IN_PROGRESS" },
          include: {
            course: true,
          },
        },
        activityLogs: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        },
        rewards: {
          where: { status: "EARNED" },
        },
      },
    }) as UserWithRelations | null;

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate current course and progress
    const currentEnrollment = user.enrolledCourses[0];
    const currentCourse = currentEnrollment?.course || null;
    const courseProgress = currentEnrollment?.progress || 0;

    // Calculate token balance and weekly earnings
    const tokenBalance = user.rewards.reduce((acc: number, reward: Reward) => acc + reward.amount, 0);
    const weeklyEarnings = user.activityLogs.reduce((acc: number, log: ActivityLog & { data: ActivityData | null }) => {
      return acc + (log.data?.rewardAmount || 0);
    }, 0);

    // Calculate focus score based on activity logs
    const totalActivities = user.activityLogs.length;
    const completedActivities = user.activityLogs.filter((log: ActivityLog & { data: ActivityData | null }) => {
      return log.data?.status === "COMPLETED";
    }).length;
    const focusScore = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

    // Calculate user rank (simplified version)
    const allUsers = await prisma.user.findMany({
      include: {
        activityLogs: true,
      },
    });
    
    const userRank = allUsers
      .map((u: { walletId: string; activityLogs: ActivityLog[] }) => ({
        walletId: u.walletId,
        score: u.activityLogs.length,
      }))
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .findIndex((u: { walletId: string }) => u.walletId === walletId) + 1;
    
    const rankPercentage = Math.round((userRank / allUsers.length) * 100);

    // Calculate next milestone
    const nextMilestone = {
      amount: 100, // Base milestone amount
      requirement: "Complete 5 more lectures",
    };

    return NextResponse.json({
      currentCourse: {
        title: currentCourse?.title || "No active course",
        progress: courseProgress,
      },
      tokenBalance,
      weeklyEarnings,
      nextMilestone,
      focusScore,
      rank: rankPercentage,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
