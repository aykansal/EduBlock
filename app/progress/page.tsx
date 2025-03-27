"use client";

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import ProgressDashboard from '@/components/ProgressDashboard';
import { getUserProgress, DEFAULT_WALLET_ID } from '@/lib/api';
import { UserProgress } from '@/types/playlist';

export default function ProgressPage() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progress = await getUserProgress(DEFAULT_WALLET_ID);
        setUserProgress(progress);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProgress();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-lg text-gray-600">Loading your progress data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Learning Progress</h1>
      {userProgress ? (
        <ProgressDashboard progress={userProgress} />
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-2">No progress data available yet.</p>
          <p className="text-gray-500">Start watching courses to track your learning journey!</p>
        </div>
      )}
    </div>
  );
}
