import { UserProgress } from "@/types/playlist";

export async function getUserProgress(): Promise<UserProgress> {
  // This is a placeholder function. In a real application, you would fetch this data from your API.
  return {
    currentPlaylist: {
      id: 'playlist1',
      title: 'Introduction to Machine Learning',
      thumbnailUrl: 'https://picsum.photos/seed/ml/300/200',
      totalVideos: 20,
      completedVideos: 8,
    },
    completedPlaylists: [
      {
        id: 'playlist2',
        title: 'Web Development Basics',
        thumbnailUrl: 'https://picsum.photos/seed/web/300/200',
        totalVideos: 15,
        completedVideos: 15,
      },
      {
        id: 'playlist3',
        title: 'Advanced JavaScript Concepts',
        thumbnailUrl: 'https://picsum.photos/seed/js/300/200',
        totalVideos: 25,
        completedVideos: 25,
      },
    ],
    recommendedPlaylists: [
      {
        id: 'playlist4',
        title: 'Data Structures and Algorithms',
        thumbnailUrl: 'https://picsum.photos/seed/dsa/300/200',
        totalVideos: 30,
        completedVideos: 0,
      },
      {
        id: 'playlist5',
        title: 'Mobile App Development with React Native',
        thumbnailUrl: 'https://picsum.photos/seed/rn/300/200',
        totalVideos: 22,
        completedVideos: 0,
      },
      {
        id: 'playlist6',
        title: 'Cloud Computing Fundamentals',
        thumbnailUrl: 'https://picsum.photos/seed/cloud/300/200',
        totalVideos: 18,
        completedVideos: 0,
      },
      {
        id: 'playlist7',
        title: 'Artificial Intelligence: Deep Learning',
        thumbnailUrl: 'https://picsum.photos/seed/ai/300/200',
        totalVideos: 28,
        completedVideos: 0,
      },
      {
        id: 'playlist8',
        title: 'Cybersecurity Essentials',
        thumbnailUrl: 'https://picsum.photos/seed/security/300/200',
        totalVideos: 20,
        completedVideos: 0,
      },
      {
        id: 'playlist9',
        title: 'Blockchain and Cryptocurrency',
        thumbnailUrl: 'https://picsum.photos/seed/blockchain/300/200',
        totalVideos: 24,
        completedVideos: 0,
      },
    ],
    dailyTarget: {
      sessionsCompleted: 2,
      totalSessions: 4,
      sessionDuration: 40,
      breakDuration: 5,
    },
  }
}

