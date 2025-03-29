import axios from "axios";
import { cachedFetch, apiCache } from "./cache-utils";

const DEFAULT_WALLET_ID = "0xDed2C93821726a38996Ac3d74692C0fA7C8F94C6"; 

// Dashboard Data
async function getDashboardData(walletId = DEFAULT_WALLET_ID) {
  try {
    return await cachedFetch(
      `dashboard_${walletId}`,
      async () => {
        const response = await axios.get(`/api/dashboard?walletId=${walletId}`);
        return response.data;
      },
      60000 // 1 minute cache
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      user: null,
      recentActivity: [],
      upcomingLectures: [],
      totalProgress: 0,
      courseProgress: []
    };
  }
}

// User Courses
async function getUserCourses(walletId = DEFAULT_WALLET_ID) {
  try {
    return await cachedFetch(
      `courses_${walletId}`,
      async () => {
        const response = await axios.get(`/api/course?walletId=${walletId}`);
        return response.data.courses;
      },
      300000 // 5 minutes cache
    );
  } catch (error) {
    console.error('Error fetching user courses:', error);
    return [];
  }
}

// Course Details
async function getCourseDetails(courseId: string, walletId = DEFAULT_WALLET_ID) {
  try {
    return await cachedFetch(
      `course_${courseId}_${walletId}`,
      async () => {
        const response = await axios.get(`/api/course/${courseId}?walletId=${walletId}`);
        return response.data;
      },
      300000 // 5 minutes cache
    );
  } catch (error) {
    console.error("Error fetching course details:", error);
    return null;
  }
}

// Leaderboard Data
async function getLeaderboardData() {
  try {
    return await cachedFetch(
      'leaderboard',
      async () => {
        const response = await axios.get("/api/leaderboard");
        return response.data;
      },
      120000 // 2 minutes cache
    );
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return { users: [] };
  }
}

// User Settings
async function getUserSettings(walletId = DEFAULT_WALLET_ID) {
  try {
    return await cachedFetch(
      `settings_${walletId}`,
      async () => {
        const response = await axios.get(`/api/settings?walletId=${walletId}`);
        return response.data.user;
      },
      300000 // 5 minutes cache
    );
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
}

// Update user settings
async function updateUserSettings(settings: any, walletId = DEFAULT_WALLET_ID) {
  try {
    const response = await axios.post(`/api/settings?walletId=${walletId}`, settings);
    // Invalidate the settings cache after update
    apiCache.invalidate(`settings_${walletId}`);
    return response.data;
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
}

// User Progress
async function getUserProgress(walletId = DEFAULT_WALLET_ID) {
  try {
    return await cachedFetch(
      `progress_${walletId}`,
      async () => {
        const response = await axios.get(`/api/progress?walletId=${walletId}`);
        return response.data;
      },
      120000 // 2 minutes cache
    );
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return { courses: [] };
  }
}

// Update Video Progress
async function updateVideoProgress(data: any, walletId = DEFAULT_WALLET_ID) {
  try {
    const response = await axios.post(`/api/progress?walletId=${walletId}`, data);
    // Invalidate relevant caches
    apiCache.invalidate(`progress_${walletId}`);
    apiCache.invalidate(`dashboard_${walletId}`);
    apiCache.invalidatePattern(new RegExp(`course_.*_${walletId}`));
    return response.data;
  } catch (error) {
    console.error("Error updating video progress:", error);
    throw error;
  }
}

// For scheduled lectures
async function getScheduledLectures(walletId = DEFAULT_WALLET_ID) {
  try {
    return await cachedFetch(
      `scheduled_lectures_${walletId}`,
      async () => {
        const response = await axios.get(`/api/schedule?walletId=${walletId}`);
        return response.data.scheduledLectures;
      },
      60000 // 1 minute cache
    );
  } catch (error) {
    console.error('Error fetching scheduled lectures:', error);
    return [];
  }
}

async function scheduleNewLecture(lectureData: any, walletId = DEFAULT_WALLET_ID) {
  try {
    const response = await axios.post(`/api/schedule?walletId=${walletId}`, lectureData);
    // Invalidate the scheduled lectures cache after update
    apiCache.invalidate(`scheduled_lectures_${walletId}`);
    apiCache.invalidate(`dashboard_${walletId}`);
    return response.data;
  } catch (error) {
    console.error("Error scheduling new lecture:", error);
    throw error;
  }
}

async function deleteScheduledLecture(lectureId: number, walletId = DEFAULT_WALLET_ID) {
  try {
    const response = await axios.delete(`/api/schedule/${lectureId}?walletId=${walletId}`);
    // Invalidate the scheduled lectures cache after deletion
    apiCache.invalidate(`scheduled_lectures_${walletId}`);
    apiCache.invalidate(`dashboard_${walletId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting scheduled lecture:", error);
    throw error;
  }
}

export {
  DEFAULT_WALLET_ID,
  getDashboardData,
  getUserCourses,
  getCourseDetails,
  getLeaderboardData,
  getUserProgress,
  getUserSettings,
  updateUserSettings,
  updateVideoProgress,
  getScheduledLectures,
  scheduleNewLecture,
  deleteScheduledLecture,
};
