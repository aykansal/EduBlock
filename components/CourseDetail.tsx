// components/CourseDetail.tsx (or wherever your file is)
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Video, Course } from "@/types/courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import VideoPlayer from "@/components/VideoPlayer"; // Import the new component

interface VideoProgress {
  videoId: string;
  progress: number;
  watchTime: number;
  completed: boolean;
  lastWatched: string;
}

const CourseDetail = () => {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState<VideoProgress[]>([]);
  const [courseProgress, setCourseProgress] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [courseResponse, progressResponse] = await Promise.all([
          axios.get(`/api/courses/${params.courseId}`),
          axios.get(`/api/courses/${params.courseId}/progress`),
        ]);

        setCourse(courseResponse.data.course);
        setVideoProgress(progressResponse.data.progress);

        const totalVideos = courseResponse.data.course.videos.length;
        const completedVideos = progressResponse.data.progress.filter(
          (p: VideoProgress) => p.completed
        ).length;
        setCourseProgress((completedVideos / totalVideos) * 100);

        const lastWatched = progressResponse.data.progress.sort(
          (a: VideoProgress, b: VideoProgress) =>
            new Date(b.lastWatched).getTime() -
            new Date(a.lastWatched).getTime()
        )[0];

        if (lastWatched && !lastWatched.completed) {
          const video = courseResponse.data.course.videos.find(
            (v: Video) => v.videoId === lastWatched.videoId
          );
          if (video) {
            setSelectedVideo(video);
          }
        } else if (courseResponse.data.course.videos.length > 0) {
          setSelectedVideo(courseResponse.data.course.videos[0]);
        }
      } catch (error: any) {
        console.error("Error fetching course:", error);
        setError(error.response?.data?.message || "Failed to load course");
        toast.error("Failed to load course");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [params.courseId]);

  const handleVideoSelect = (video: Video) => {
    setIsVideoLoading(true);
    setSelectedVideo(video);
    setTimeout(() => setIsVideoLoading(false), 500); // Simulate loading
  };

  const handleVideoProgress = async (
    watchTime: number,
    currentPosition: number,
    duration: number
  ) => {
    if (!selectedVideo) return;

    const progress = (currentPosition / duration) * 100;
    const completed = progress >= 90;

    try {
      const response = await axios.post(
        `/api/courses/${params.courseId}/progress`,
        {
          videoId: selectedVideo.videoId,
          progress,
          watchTime: Math.floor(watchTime),
          completed,
        }
      );

      setVideoProgress((prev) => {
        const existing = prev.find((p) => p.videoId === selectedVideo.videoId);
        if (existing) {
          return prev.map((p) =>
            p.videoId === selectedVideo.videoId
              ? {
                  ...p,
                  progress,
                  watchTime: Math.floor(watchTime),
                  completed,
                  lastWatched: new Date().toISOString(),
                }
              : p
          );
        }
        return [
          ...prev,
          {
            videoId: selectedVideo.videoId,
            progress,
            watchTime: Math.floor(watchTime),
            completed,
            lastWatched: new Date().toISOString(),
          },
        ];
      });

      setCourseProgress(response.data.courseProgress.percentage);
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to save progress");
    }
  };

  const getVideoProgress = (videoId: string): VideoProgress => {
    return (
      videoProgress.find((p) => p.videoId === videoId) || {
        videoId,
        progress: 0,
        watchTime: 0,
        completed: false,
        lastWatched: new Date().toISOString(),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-gray-600">Loading course content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900">
            Error Loading Course
          </h1>
          <p className="text-gray-600 text-center max-w-md">{error}</p>
          <Button
            onClick={() => router.push("/courses")}
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <AlertCircle className="w-12 h-12 text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900">Course Not Found</h1>
          <p className="text-gray-600">
            The course you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.push("/courses")}
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={courseProgress} className="w-48" />
            <span className="text-sm text-gray-600">
              {Math.round(courseProgress)}% Complete
            </span>
          </div>
        </div>
        <Button
          onClick={() => router.push("/courses")}
          variant="outline"
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {isVideoLoading ? (
                <div className="aspect-video flex items-center justify-center bg-gray-100">
                  <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-gray-600">Loading video...</p>
                  </div>
                </div>
              ) : selectedVideo ? (
                <div className="aspect-video">
                  <VideoPlayer
                    videoId={selectedVideo.videoId}
                    initialPosition={
                      getVideoProgress(selectedVideo.videoId).watchTime
                    }
                    onProgress={handleVideoProgress}
                  />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500">Select a video to play</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Video List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {course.videos.map((video) => {
                  const progress = getVideoProgress(video.videoId);
                  return (
                    <button
                      key={video.videoId}
                      onClick={() => handleVideoSelect(video)}
                      disabled={isVideoLoading}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedVideo?.videoId === video.videoId
                          ? "bg-blue-50 border-blue-200"
                          : "hover:bg-gray-50 border-gray-100"
                      } border ${
                        isVideoLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-24 h-16 object-cover rounded"
                          />
                          {selectedVideo?.videoId === video.videoId &&
                            isVideoLoading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                              </div>
                            )}
                          {progress.completed ? (
                            <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          ) : progress.progress > 0 ? (
                            <div
                              className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-b"
                              style={{ width: `${progress.progress}%` }}
                            />
                          ) : null}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {video.channelTitle}
                          </p>
                          {progress.progress > 0 && !progress.completed && (
                            <p className="text-xs text-blue-500 mt-1">
                              {Math.round(progress.progress)}% watched
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
