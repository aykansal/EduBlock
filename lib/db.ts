// import { PlaylistCreateInput, RewardCreateInput, UserCreateInput, WatchHistoryCreateInput } from '@/types/prisma';

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// // User Queries
// export const userQueries = {
//     // Create new user
//     async createUser(data: UserCreateInput) {
//         await prisma.user.create({
//             data,
//         });
//     },

//     // Get user by wallet address
//     async getUserByWallet(walletAddress: string) {
//         return await prisma.user.findUnique({
//             where: { walletAddress },
//             // include: {
//             //     watchHistory: true,
//             //     courseProgress: true,
//             //     rewards: true,
//             //     playlists: true,
//             // },
//         });
//     },

//     // Update user settings
//     async updateUserSettings(userId: string, data: Partial<UserCreateInput>) {
//         return await prisma.user.update({
//             where: { id: userId },
//             data,
//         });
//     },
// };
// // Playlist Queries
// export const playlistQueries = {
//     // Create new playlist
//     async createPlaylist(data: PlaylistCreateInput) {
//         return await prisma.playlist.create({
//             data: {
//                 ...data,
//                 videos: {
//                     create: data.videos,
//                 },
//             },
//         });
//     },

//     // Get playlist with videos
//     async getPlaylistWithVideos(playlistId: string) {
//         return await prisma.playlist.findUnique({
//             where: { id: playlistId },
//             include: {
//                 videos: true,
//             },
//         });
//     },

//     // Get user's active playlists
//     async getUserActivePlaylists(userId: string) {
//         return await prisma.playlist.findMany({
//             where: {
//                 courseProgress: {
//                     some: {
//                         userId,
//                         completed: false,
//                     },
//                 },
//             },
//             include: {
//                 videos: true,
//                 courseProgress: true,
//             },
//         });
//     },
// };
// // Watch History Queries
// export const watchHistoryQueries = {
//     // Record watch time
//     async recordWatchTime(data: WatchHistoryCreateInput) {
//         return await prisma.watchHistory.create({
//             data,
//         });
//     },

//     // Get user's watch history
//     async getUserWatchHistory(userId: string) {
//         return await prisma.watchHistory.findMany({
//             where: { userId },
//             include: {
//                 video: true,
//             },
//             orderBy: {
//                 createdAt: 'desc',
//             },
//         });
//     },

//     // Get total watch time for user
//     async getUserTotalWatchTime(userId: string) {
//         const result = await prisma.watchHistory.aggregate({
//             where: { userId },
//             _sum: {
//                 watchTime: true,
//             },
//         });
//         return result._sum.watchTime || 0;
//     },
// };
// Course Progress Queries
// export const courseProgressQueries = {
//     // Create or update course progress
//     async updateCourseProgress(data: CourseProgressCreateInput) {
//         return await prisma.courseProgress.upsert({
//             where: {
//                 userId: data.userId,
//                 playlistId: data.playlistId,
//             },
//             update: {
//                 completed: data.completed,
//             },
//             create: data,
//         });
//     },
//     // Get user's course progress
//     async getUserCourseProgress(userId: string) {
//         return await prisma.courseProgress.findMany({
//             where: { userId },
//             include: {
//                 playlist: true,
//             },
//         });
//     },
// };
// Reward Queries
// export const rewardQueries = {
//     // Create new reward
//     async createReward(data: RewardCreateInput) {
//         return await prisma.reward.create({
//             data,
//         });
//     },

//     // Get user's rewards summary
//     async getUserRewardsSummary(userId: string) {
//         const totalRewards = await prisma.reward.aggregate({
//             where: { userId },
//             _sum: {
//                 amount: true,
//             },
//         });

//         const todayRewards = await prisma.reward.aggregate({
//             where: {
//                 userId,
//                 createdAt: {
//                     gte: new Date(new Date().setHours(0, 0, 0, 0)),
//                 },
//             },
//             _sum: {
//                 amount: true,
//             },
//         });

//         return {
//             totalTokens: totalRewards._sum.amount || 0,
//             todayEarnings: todayRewards._sum.amount || 0,
//         };
//     },

//     // Get weekly rewards stats
//     async getWeeklyRewardsStats(userId: string) {
//         const sevenDaysAgo = new Date();
//         sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//         return await prisma.reward.groupBy({
//             by: ['createdAt'],
//             where: {
//                 userId,
//                 createdAt: {
//                     gte: sevenDaysAgo,
//                 },
//             },
//             _sum: {
//                 amount: true,
//             },
//         });
//     },
// };
// // Leaderboard Query
// export const leaderboardQueries = {
//     // Get platform leaderboard
//     async getLeaderboard() {
//         const users = await prisma.user.findMany({
//             select: {
//                 id: true,
//                 username: true,
//                 watchHistory: {
//                     select: {
//                         watchTime: true,
//                     },
//                 },
//                 rewards: {
//                     select: {
//                         amount: true,
//                     },
//                 },
//             },
//         });

//         return users.map(user => ({
//             userId: user.id,
//             username: user.username,
//             totalWatchTime: user.watchHistory.reduce((acc, curr) => acc + curr.watchTime, 0),
//             totalTokens: user.rewards.reduce((acc, curr) => acc + curr.amount, 0),
//         })).sort((a, b) => b.totalWatchTime - a.totalWatchTime);
//     },
// };