'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { User } from '../types/user';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getLeaderboardData } from '@/lib/api';

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [visibleUsers, setVisibleUsers] = useState(7);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setIsLoading(true);
        const leaderboardUsers = await getLeaderboardData();
        setUsers(leaderboardUsers);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        // Fallback data if API fails
        setUsers([
          { id: 1, name: "Alice Cooper", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Alice", watchTime: 1200, tokens: 150 },
          { id: 2, name: "Bob Marley", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Bob", watchTime: 1100, tokens: 140 },
          { id: 3, name: "Charlie Brown", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Charlie", watchTime: 1000, tokens: 130 }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, []);

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleShowMore = () => {
    setVisibleUsers(prevVisible => Math.min(prevVisible + 5, users.length));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-lg text-gray-600">Loading leaderboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Leaderboard</h2>
      {users.length > 0 ? (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Watch Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.slice(0, visibleUsers).map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10">
                          <Image className="h-10 w-10 rounded-full" src={user.avatar} alt={`${user.name}'s avatar`} width={40} height={40} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatWatchTime(user.watchTime)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.tokens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {visibleUsers < users.length && (
            <div className="mt-4 text-center">
              <Button onClick={handleShowMore} variant="outline">
                Show More
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No leaderboard data available yet.</p>
          <p className="text-sm text-gray-500">Start watching courses to appear on the leaderboard!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
