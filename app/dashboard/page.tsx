"use client";

import { RecentActivity } from "@/components/recent-activity";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpcomingLectures } from "@/components/upcoming-lectures";
import { CalendarDays, GraduationCap, Trophy } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDataFetching } from "@/hooks/use-data-fetching";
import { getStreak } from "@/lib/streak-utils";

interface DashboardData {
  currentCourse: {
    title: string;
    progress: number;
  };
  tokenBalance: number;
  weeklyEarnings: number;
  nextMilestone: {
    amount: number;
    requirement: string;
  };
  focusScore: number;
  rank: number;
}

async function fetchDashboardData(walletId: string) {
  const response = await axios.get(`/api/dashboard?walletId=${walletId}`);
  return response.data;
}

export default function DashboardPage() {
  const account = useActiveAccount();
  const { data: dashboardData, isLoading } = useDataFetching(
    fetchDashboardData,
    {
      skipIfNoWallet: true,
      defaultValue: {
        currentCourse: { title: "No active course", progress: 0 },
        tokenBalance: 0,
        weeklyEarnings: 0,
        nextMilestone: { amount: 0, requirement: "No milestone set" },
        focusScore: 0,
        rank: 0
      }
    }
  );

  const { data: streakData } = useDataFetching(
    getStreak,
    {
      skipIfNoWallet: true,
      defaultValue: { currentStreak: 0, bestStreak: 0 }
    }
  );

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Please connect your wallet to view your dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-6 py-8 container">
      <h1 className="mb-6 font-semibold text-3xl text-gray-800">
        Dashboard
      </h1>
      <div className="gap-6 grid md:grid-cols-2 xl:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Current Session
            </CardTitle>
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {dashboardData.currentCourse.title}
            </div>
            <Progress value={dashboardData.currentCourse.progress} className="mt-2" />
            <p className="mt-2 text-muted-foreground text-xs">
              {dashboardData.currentCourse.progress}% complete
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              EduToken Balance
            </CardTitle>
            <Trophy className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{dashboardData.tokenBalance} EDT</div>
            <p className="mt-2 text-muted-foreground text-xs">
              +{dashboardData.weeklyEarnings} EDT this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Next Milestone
            </CardTitle>
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{dashboardData.nextMilestone.amount} EDT</div>
            <p className="mt-2 text-muted-foreground text-xs">
              {dashboardData.nextMilestone.requirement}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Focus Score
            </CardTitle>
            <Trophy className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{dashboardData.focusScore}%</div>
            <p className="mt-2 text-muted-foreground text-xs">
              Top {dashboardData.rank}% of all users
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="gap-6 grid md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your learning progress this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Lectures</CardTitle>
            <CardDescription>
              Your schedule for the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingLectures />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Rewards</CardTitle>
          <CardDescription>
            Redeem your EduTokens for perks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="available" className="w-full">
            <TabsList>
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="redeemed">Redeemed</TabsTrigger>
            </TabsList>
            <TabsContent value="available">
              <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Certificate</CardTitle>
                    <CardDescription>100 EDT</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Get a verified certificate for completing this
                      course.
                    </p>
                    <Button 
                      className="mt-4 w-full"
                      disabled={dashboardData.tokenBalance < 100}
                    >
                      {dashboardData.tokenBalance < 100 ? "Insufficient Balance" : "Redeem"}
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>1-on-1 Tutoring</CardTitle>
                    <CardDescription>250 EDT</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      30-minute one-on-one session with a course
                      instructor.
                    </p>
                    <Button 
                      className="mt-4 w-full"
                      disabled={dashboardData.tokenBalance < 250}
                    >
                      {dashboardData.tokenBalance < 250 ? "Insufficient Balance" : "Redeem"}
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Premium Course Access</CardTitle>
                    <CardDescription>500 EDT</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Unlock access to a premium course of your choice.
                    </p>
                    <Button 
                      className="mt-4 w-full"
                      disabled={dashboardData.tokenBalance < 500}
                    >
                      {dashboardData.tokenBalance < 500 ? "Insufficient Balance" : "Redeem"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="redeemed">
              <p>You haven't redeemed any rewards yet.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
