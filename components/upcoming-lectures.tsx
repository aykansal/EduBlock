"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import axios from "axios";
import { useActiveAccount } from 'thirdweb/react';

interface Lecture {
  id: number;
  title: string;
  date: string;
  duration: string;
  courseTitle?: string;
}

export function UpcomingLectures() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const account = useActiveAccount();

  useEffect(() => {
    const fetchLectures = async () => {
      if (!account) return;
      try {
        const response = await axios.get(`/api/dashboard?walletId=${account.address}`);
        if (response.data.upcomingLectures) {
          setLectures(response.data.upcomingLectures);
        }
      } catch (error) {
        console.error("Error fetching upcoming lectures:", error);
        // Set some fallback data if fetch fails
        setLectures([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLectures();
  }, [account]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 animate-pulse"
          >
            <div className="h-5 w-5 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            </div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (lectures.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>No upcoming lectures scheduled.</p>
        <p className="text-sm mt-2">Add new courses to see your schedule!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lectures.map((lecture) => (
        <div key={lecture.id} className="flex items-center space-x-4">
          <CalendarDays className="h-5 w-5 text-blue-500" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{lecture.title}</p>
            {lecture.courseTitle && (
              <p className="text-xs text-blue-600">{lecture.courseTitle}</p>
            )}
            <p className="text-sm text-muted-foreground">{lecture.date}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {lecture.duration}
          </div>
        </div>
      ))}
    </div>
  );
}
