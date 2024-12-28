export interface Playlist {
  id: string;
  title: string;
  thumbnailUrl: string;
  totalVideos: number;
  completedVideos: number;
}

export interface UserProgress {
  currentPlaylist: Playlist;
  completedPlaylists: Playlist[];
  recommendedPlaylists: Playlist[];
  dailyTarget: {
    sessionsCompleted: number;
    totalSessions: number;
    sessionDuration: number;
    breakDuration: number;
  };
}

