"use client";

import axios from "axios";
import { Loader2 } from "lucide-react";
import { Video, Course } from "@/types/courses";
import React, { useState, FormEvent, useEffect } from "react";
import { extractPlaylistId } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Utility function to validate YouTube URL
const validateUrl = (url: string) => {
  const playlistId = extractPlaylistId(url);
  if (!playlistId) {
    toast.error("Invalid YouTube playlist URL. Please enter a valid URL.");
  }
  return playlistId;
};

const YoutubePlaylist = () => {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const walletId = "0xDed2C93821726a38996Ac3d74692C0fA7C8F94C6"; // Make sure to set this dynamically

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    console.log("hi");
    try {
      const response = await axios.get(`/api/courses?walletId=${walletId}`);
      console.log(response.data);
      setEnrolledCourses(response.data.courses);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      toast.error("Failed to load enrolled courses");
    }
  };

  const fetchPlaylistData = async (e: FormEvent) => {
    e.preventDefault();

    const playlistId = validateUrl(url);
    if (!playlistId) return;

    setIsLoading(true);

    try {
      const response = await axios.post("/api/courses/add", {
        playlistId,
        walletId,
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
                className="flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          {enrolledCourses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {enrolledCourses.map((course: Course) => (
                <Link
                  href={`/courses/${course.id}`}
                  key={course.id}
                  className="block"
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-video relative mb-4">
                        <img
                          src={
                            course.videos[0]?.thumbnail ||
                            "/placeholder-course.jpg"
                          }
                          alt={course.title}
                          className="rounded-lg object-cover w-full h-full"
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {course.videoCount} videos
                      </p>
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
