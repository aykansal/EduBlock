import { RecentActivity } from "@/components/recent-activity"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UpcomingLectures } from "@/components/upcoming-lectures"
import { CalendarDays, GraduationCap, Trophy, PlusCircle } from 'lucide-react'
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Session</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Introduction to Blockchain</div>
            <Progress value={33} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">33% complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EduToken Balance</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">250 EDT</div>
            <p className="text-xs text-muted-foreground mt-2">+50 EDT this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Milestone</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75 EDT</div>
            <p className="text-xs text-muted-foreground mt-2">Complete 5 more lectures</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground mt-2">Top 5% of all users</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your learning progress this week</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Lectures</CardTitle>
            <CardDescription>Your schedule for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingLectures />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Custom Courses</CardTitle>
          <CardDescription>Courses you've created or enrolled in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Blockchain for Beginners</CardTitle>
                <CardDescription>Created by you</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Your custom introduction to blockchain technology.</p>
                <Button className="mt-4 w-full">Continue Learning</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Advanced Smart Contracts</CardTitle>
                <CardDescription>Created by you</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Deep dive into complex smart contract patterns.</p>
                <Button className="mt-4 w-full">Continue Learning</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Create New Course</CardTitle>
                <CardDescription>Design your own learning path</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Start building a new custom course tailored to your needs.</p>
                <Button className="mt-4 w-full" asChild>
                  <Link href="/create-course">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create Course
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

