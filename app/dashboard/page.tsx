import { Header } from "@/components/header";
import { RecentActivity } from "@/components/recent-activity";
import { Sidebar } from "@/components/sidebar";
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

export default function DashboardPage() {
  return (
    <div className="flex bg-gray-100 h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 bg-gray-100 overflow-x-hidden overflow-y-auto">
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
                    Introduction to Blockchain
                  </div>
                  <Progress value={33} className="mt-2" />
                  <p className="mt-2 text-muted-foreground text-xs">
                    33% complete
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
                  <div className="font-bold text-2xl">250 EDT</div>
                  <p className="mt-2 text-muted-foreground text-xs">
                    +50 EDT this week
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
                  <div className="font-bold text-2xl">75 EDT</div>
                  <p className="mt-2 text-muted-foreground text-xs">
                    Complete 5 more lectures
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
                  <div className="font-bold text-2xl">92%</div>
                  <p className="mt-2 text-muted-foreground text-xs">
                    Top 5% of all users
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
                          <Button className="mt-4 w-full">Redeem</Button>
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
                          <Button className="mt-4 w-full">Redeem</Button>
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
                          <Button className="mt-4 w-full">Redeem</Button>
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
        </main>
      </div>
    </div>
  );
}
