import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ApiError, handleApiError } from '@/lib/api-utils';

const prisma = new PrismaClient();

// Helper function to calculate streak
async function calculateStreak(walletId: string) {
  const user = await prisma.user.findUnique({
    where: { walletId },
    select: {
      currentStreak: true,
      bestStreak: true,
      lastActivityDate: true,
      activityLogs: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { createdAt: true }
      }
    }
  });

  if (!user) return { currentStreak: 0, bestStreak: 0 };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = user.activityLogs[0]?.createdAt || user.lastActivityDate;
  
  if (!lastActivity) {
    return { currentStreak: 0, bestStreak: user.bestStreak };
  }

  const lastActivityDate = new Date(lastActivity);
  lastActivityDate.setHours(0, 0, 0, 0);

  const daysSinceLastActivity = Math.floor(
    (today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // If more than 1 day has passed, reset streak
  if (daysSinceLastActivity > 1) {
    await prisma.user.update({
      where: { walletId },
      data: { currentStreak: 0 }
    });
    return { currentStreak: 0, bestStreak: user.bestStreak };
  }

  return {
    currentStreak: user.currentStreak,
    bestStreak: user.bestStreak
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const walletId = searchParams.get('walletId');

    if (!walletId) {
      throw new ApiError('Wallet ID is required', 400, 'MISSING_WALLET');
    }

    const streak = await calculateStreak(walletId);
    return NextResponse.json(streak);
  } catch (error) {
    const { error: errorMessage, status, code } = handleApiError(error);
    return NextResponse.json(
      { error: errorMessage, code },
      { status }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { walletId, activityType, data } = await req.json();

    if (!walletId) {
      throw new ApiError('Wallet ID is required', 400, 'MISSING_WALLET');
    }

    if (!activityType) {
      throw new ApiError('Activity type is required', 400, 'MISSING_ACTIVITY_TYPE');
    }

    const user = await prisma.user.findUnique({
      where: { walletId },
      select: {
        currentStreak: true,
        bestStreak: true,
        lastActivityDate: true,
      },
    });

    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivityDate = user.lastActivityDate ? new Date(user.lastActivityDate) : null;
    if (lastActivityDate) {
      lastActivityDate.setHours(0, 0, 0, 0);
    }

    let { currentStreak, bestStreak } = user;

    // If this is the first activity or it's a new day
    if (!lastActivityDate || lastActivityDate.getTime() < today.getTime()) {
      currentStreak += 1;
      
      // Update best streak if current streak is higher
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
    }

    // Create activity log
    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { walletId },
        data: {
          currentStreak,
          bestStreak,
          lastActivityDate: new Date(),
        },
      }),
      prisma.activityLog.create({
        data: {
          userId: walletId,
          type: activityType,
          data: data || {},
        },
      }),
    ]);

    return NextResponse.json({
      currentStreak: updatedUser.currentStreak,
      bestStreak: updatedUser.bestStreak,
    });
  } catch (error) {
    const { error: errorMessage, status, code } = handleApiError(error);
    return NextResponse.json(
      { error: errorMessage, code },
      { status }
    );
  }
} 