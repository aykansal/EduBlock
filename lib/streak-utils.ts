import axios from 'axios';

export type ActivityType = 
  | 'video_watched'
  | 'course_completed'
  | 'quiz_completed'
  | 'assignment_submitted'
  | 'daily_login';

interface StreakResponse {
  currentStreak: number;
  bestStreak: number;
}

/**
 * Updates the user's streak and logs the activity
 * @param walletId - The user's wallet ID
 * @param activityType - The type of activity performed
 * @param data - Additional data about the activity
 * @returns Promise with updated streak information
 */
export async function updateStreak(
  walletId: string,
  activityType: ActivityType,
  data?: Record<string, any>
): Promise<StreakResponse> {
  try {
    const response = await axios.post('/api/user/streak', {
      walletId,
      activityType,
      data,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
}

/**
 * Gets the user's current streak information
 * @param walletId - The user's wallet ID
 * @returns Promise with current streak information
 */
export async function getStreak(walletId: string): Promise<StreakResponse> {
  try {
    const response = await axios.get(`/api/user?streak=true&walletId=${walletId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching streak:', error);
    throw error;
  }
} 