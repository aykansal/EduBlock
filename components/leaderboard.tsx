'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { User } from '../types/user';
import { Button } from "@/components/ui/button"

// Sample user data
const users: User[] = [
  { id: 1, name: "Alice Cooper", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Alice", watchTime: 1200, tokens: 150 },
  { id: 2, name: "Bob Marley", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Bob", watchTime: 1100, tokens: 140 },
  { id: 3, name: "Charlie Brown", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Charlie", watchTime: 1000, tokens: 130 },
  { id: 4, name: "David Bowie", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=David", watchTime: 900, tokens: 120 },
  { id: 5, name: "Eva Green", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Eva", watchTime: 800, tokens: 110 },
  { id: 6, name: "Frank Sinatra", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Frank", watchTime: 700, tokens: 100 },
  { id: 7, name: "Grace Kelly", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Grace", watchTime: 600, tokens: 90 },
  { id: 8, name: "Harry Potter", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Harry", watchTime: 500, tokens: 80 },
  { id: 9, name: "Iris West", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Iris", watchTime: 400, tokens: 70 },
  { id: 10, name: "Jack Sparrow", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Jack", watchTime: 300, tokens: 60 },
];

const Leaderboard: React.FC = () => {
  const [visibleUsers, setVisibleUsers] = useState(7);

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleShowMore = () => {
    setVisibleUsers(prevVisible => Math.min(prevVisible + 5, users.length));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Leaderboard</h2>
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
                    <div className="flex-shrink-0 h-10 w-10">
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
    </div>
  );
};

export default Leaderboard;

