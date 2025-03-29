export interface UserCreateInput {
    walletAddress: string;
    username: string;
    name: string;
    email?: string;
    notificationsEnabled?: boolean;
    soundEffectsEnabled?: boolean;
    darkModeEnabled?: boolean;
    sessionDuration?: number;
    breakDuration?: number;
    sessionsPerDay?: number;
}

export interface PlaylistCreateInput {
    title: string;
    description?: string;
    url: string;
    videos?: VideoCreateInput[];
}

export interface VideoCreateInput {
    title: string;
    description?: string;
    url: string;
    duration: number;
    playlistId: string;
}

export interface WatchHistoryCreateInput {
    userId: string;
    videoId: string;
    watchTime: number;
    completed?: boolean;
}

export interface CourseProgressCreateInput {
    userId: string;
    playlistId: string;
    completed?: boolean;
}

export interface RewardCreateInput {
    userId: string;
    amount: number;
    reason: string;
}
