"use client";

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import axios from 'axios';

interface Activity {
  id: number;
  title: string;
  type: string;
  date: string;
  courseTitle?: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const walletId = "0xDed2C93821726a38996Ac3d74692C0fA7C8F94C6"; // Should be set dynamically
  
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`/api/dashboard?walletId=${walletId}`);
        if (response.data.recentActivity) {
          setActivities(response.data.recentActivity);
        }
      } catch (error) {
        console.error("Error fetching recent activities:", error);
        // Set some fallback data if fetch fails
        setActivities([
          { id: 1, title: "Completed Lecture: Blockchain Basics", type: "completion", date: "2 hours ago" },
          { id: 2, title: "Earned 50 EDT", type: "reward", date: "1 day ago" }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4 animate-pulse">
            <div className="h-5 w-5 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>No recent activity to show.</p>
        <p className="text-sm mt-2">Start watching courses to track your progress!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-4">
          {activity.type === "completion" ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : activity.type === "reward" ? (
            <CheckCircle2 className="h-5 w-5 text-amber-500" />
          ) : (
            <Clock className="h-5 w-5 text-blue-500" />
          )}
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.title}</p>
            {activity.courseTitle && (
              <p className="text-xs text-blue-600">{activity.courseTitle}</p>
            )}
            <p className="text-sm text-muted-foreground">{activity.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
