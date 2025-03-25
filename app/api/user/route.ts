import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ApiError, handleApiError } from '@/lib/api-utils';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      throw new ApiError('Wallet address is required', 400, 'MISSING_WALLET');
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { walletId: walletAddress }
    });

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    // Generate a unique username based on wallet address
    const shortWallet = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    const username = `user_${shortWallet}`;

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        name: username,
        walletId: walletAddress,
        notificationsEnabled: true,
        soundEffectsEnabled: true,
        darkModeEnabled: false,
        sessionDuration: 25,
        breakDuration: 5,
        sessionsPerDay: 4
      }
    });

    return NextResponse.json({ user: newUser });
  } catch (error) {
    const { error: errorMessage, status, code } = handleApiError(error);
    return NextResponse.json(
      { error: errorMessage, code },
      { status }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      throw new ApiError('Wallet address is required', 400, 'MISSING_WALLET');
    }

    const user = await prisma.user.findUnique({
      where: { walletId: walletAddress }
    });

    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
    }

    return NextResponse.json({ user });
  } catch (error) {
    const { error: errorMessage, status, code } = handleApiError(error);
    return NextResponse.json(
      { error: errorMessage, code },
      { status }
    );
  }
}