"use client";

import { Loader2, BookOpen } from "lucide-react";
import { Video, Course } from "@/types/courses";
import React, { useState, FormEvent, useEffect } from "react";
import { extractPlaylistId } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { getUserCourses } from "@/lib/api";
import { useActiveAccount } from "thirdweb/react";

// Utility function to validate YouTube URL
const validateUrl = (url: string) => {
  const playlistId = extractPlaylistId(url);
  if (!playlistId) {
    toast.error("Invalid YouTube playlist URL. Please enter a valid URL.");
  }
  return playlistId;
};

const CourseThumbnailFallback = ({ title }: { title: string }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-50 to-gray-100 rounded-lg">
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <BookOpen className="text-blue-400 mb-2" size={32} />
        <span className="text-sm text-gray-600 font-medium line-clamp-2">
          {title || "Course"}
        </span>
      </div>
    </div>
  );
};

const YoutubePlaylist = () => {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCoursesLoading, setIsCoursesLoading] = useState<boolean>(true);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const account = useActiveAccount();

  // Fetch enrolled courses using our unified API function
  const fetchEnrolledCourses = async () => {
    if (!account) return;
    try {
      setIsCoursesLoading(true);
      const courses = await getUserCourses(account.address);
      setEnrolledCourses(courses);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      toast.error("Failed to load enrolled courses");
    } finally {
      setIsCoursesLoading(false);
    }
  };

  const fetchPlaylistData = async (e: FormEvent) => {
    e.preventDefault();
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    const playlistId = validateUrl(url);
    if (!playlistId) return;

    setIsLoading(true);

    try {
      const response = await axios.post("/api/course/add", {
        playlistId,
        walletId: account.address,
      });

      if (
        response.status === 200 &&
        response.data.message === "Course already exists"
      ) {
        toast("Course already exists.");
        return;
      }

      if (response.status === 201) {
        toast.success("Playlist added to your Courses!");
        fetchEnrolledCourses(); // Refresh the courses list
      }
    } catch (err: any) {
      if (
        err.response?.status === 400 &&
        err.response?.data.message === "Playlist ID is required"
      ) {
        toast.error("Invalid YouTube playlist URL. Please enter a valid URL.");
      } else {
        toast.error(err.message || "An error occurred while fetching data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  return (
    <div className="mx-auto p-4 w-full max-w-4xl space-y-8">
      {/* Add New Course Section */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={fetchPlaylistData} className="mb-6">
            <div className="flex sm:flex-row flex-col gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter YouTube playlist URL"
                className="flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <span className="flex justify-center items-center">
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Add Course"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Enrolled Courses Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {isCoursesLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
          ) : enrolledCourses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {enrolledCourses.map((course: Course) => (
                <Link
                  href={`/courses/${course.id}`}
                  key={course.id}
                  className="block"
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-4">
                      <div className="aspect-video relative mb-4 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={
                            course.videos[0]?.thumbnail ||
                            "/placeholder-course.jpg"
                          }
                          alt={course.title}
                          className="rounded-lg object-cover w-full h-full"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden absolute inset-0">
                          <CourseThumbnailFallback title={course.title} />
                        </div>
                        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          {course.videoCount} videos
                        </p>
                        <div className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                          Course
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't enrolled in any courses yet.</p>
              <p className="text-sm mt-2">
                Add a course using the form above to get started!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default YoutubePlaylist;
