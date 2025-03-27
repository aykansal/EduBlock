import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { ApiError, handleApiError } from '@/lib/api-utils';

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

        // Get user data
        const user = await prisma.user.findUnique({
            where: { walletId }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Format user data for the frontend
        return NextResponse.json({
            user: {
                walletId: user.walletId,
                username: user.username || '',
                email: user.email || '',
                avatar: user.avatar || 'https://api.dicebear.com/6.x/bottts/svg?seed=Buddy',
                preferences: {
                    sessionDuration: user.sessionDuration || 40,
                    breakDuration: user.breakDuration || 5,
                    sessionsPerDay: user.sessionsPerDay || 4,
                    notifications: user.notificationsEnabled || true,
                    darkMode: user.darkModeEnabled || false,
                    soundEffects: user.soundEffectsEnabled || true
                }
            }
        });
    } catch (error: any) {
        console.error('Error fetching user settings:', error);
        const { error: errorMessage, status } = handleApiError(error);
        return NextResponse.json(
            { message: 'Error fetching user settings', details: errorMessage },
            { status }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const walletId = searchParams.get('walletId');

        if (!walletId) {
            return NextResponse.json(
                { message: 'Wallet ID is required' },
                { status: 400 }
            );
        }

        const userData = await request.json();
        
        // Extract preferences object if it exists
        const preferences = userData.preferences || {};
        
        // Update user data with direct fields from the User model
        const updatedUser = await prisma.user.update({
            where: { walletId },
            data: {
                username: userData.username,
                email: userData.email,
                avatar: userData.avatar,
                sessionDuration: preferences.sessionDuration,
                breakDuration: preferences.breakDuration,
                sessionsPerDay: preferences.sessionsPerDay,
                notificationsEnabled: preferences.notifications,
                darkModeEnabled: preferences.darkMode,
                soundEffectsEnabled: preferences.soundEffects
            }
        });

        // Format the response in the same structure as the request
        return NextResponse.json({
            message: 'User settings updated successfully',
            user: {
                walletId: updatedUser.walletId,
                username: updatedUser.username,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                preferences: {
                    sessionDuration: updatedUser.sessionDuration || 40,
                    breakDuration: updatedUser.breakDuration || 5,
                    sessionsPerDay: updatedUser.sessionsPerDay || 4,
                    notifications: updatedUser.notificationsEnabled || true,
                    darkMode: updatedUser.darkModeEnabled || false,
                    soundEffects: updatedUser.soundEffectsEnabled || true
                }
            }
        });
    } catch (error: any) {
        console.error('Error updating user settings:', error);
        const { error: errorMessage, status } = handleApiError(error);
        return NextResponse.json(
            { message: 'Error updating user settings', details: errorMessage },
            { status }
        );
    }
}
