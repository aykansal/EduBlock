"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Video, Course } from "@/types/courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useActiveAccount } from "thirdweb/react";
import { updateStreak } from "@/lib/streak-utils";

// Dynamically import the YouTube player component to avoid SSR issues
const YouTubePlayer = dynamic(() => import("@/components/YouTubePlayer"), {
  ssr: false,
  loading: () => (
    <div className="aspect-video flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-gray-600">Loading player...</p>
      </div>
    </div>
  ),
});

interface VideoProgress {
  videoId: string;
  progress: number;
  completed: boolean;
}

// Add this helper component for fallback thumbnails
const ThumbnailFallback = ({ title }: { title: string }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <BookOpen className="text-gray-400 mb-1" size={16} />
        <span className="text-xs text-gray-500 line-clamp-1">
          {title || "Video"}
        </span>
      </div>
    </div>
  );
};

const CourseDetail = () => {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState<
    Record<string, VideoProgress>
  >({});
  const [currentVideoProgress, setCurrentVideoProgress] = useState<number>(0);
  const account = useActiveAccount();

  const fetchCourse = async () => {
    if (!account) {
      router.push("/");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Fetch course details
      const courseResponse = await axios.get(`/api/courses/${params.courseId}`);
      setCourse(courseResponse.data.course);

      // Fetch progress for this course
      const progressResponse = await axios.get(
        `/api/courses/progress?walletId=${account.address}&courseId=${params.courseId}`
      );

      // Create a map of video progress
      const progressMap: Record<string, VideoProgress> = {};
      progressResponse.data.progress.forEach((p: any) => {
        progressMap[p.videoId] = {
          videoId: p.videoId,
          progress: p.progress,
          completed: p.completed,
        };
      });
      setVideoProgress(progressMap);

      // Set the initial video - either the last watched or the first one
      const lastWatchedVideoId = progressResponse.data.lastWatchedVideo;
      console.log(lastWatchedVideoId);
      if (lastWatchedVideoId) {
        const lastWatchedVideo = courseResponse.data.course.videos.find(
          (v: Video) => v.videoId === lastWatchedVideoId
        );
        console.log("lastWatchedVideo", lastWatchedVideo);
        handleVideoSelect(lastWatchedVideo);
        // setSelectedVideo(lastWatchedVideo);

        if (progressMap[lastWatchedVideoId]) {
          setCurrentVideoProgress(progressMap[lastWatchedVideoId].progress);
        }
      } else if (courseResponse.data.course.videos.length > 0) {
        console.log(
          "courseResponse.data.course.videos[0]",
          courseResponse.data.course.videos[0]
        );
        handleVideoSelect(courseResponse.data.course.videos[0]);
        // setSelectedVideo(courseResponse.data.course.videos[0]);

        if (progressMap[courseResponse.data.course.videos[0].videoId]) {
          setCurrentVideoProgress(
            progressMap[courseResponse.data.course.videos[0].videoId].progress
          );
        }
      }
    } catch (error: any) {
      console.error("Error fetching course:", error);
      setError(error.response?.data?.message || "Failed to load course");
      toast.error("Failed to load course");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [params.courseId, account]);

  const handleVideoSelect = (video: Video) => {
    setIsVideoLoading(true);
    setSelectedVideo(video);

    // Set current progress for the selected video
    if (videoProgress[video.videoId]) {
      setCurrentVideoProgress(videoProgress[video.videoId].progress);
    } else {
      setCurrentVideoProgress(0);
    }

    // Simulate loading state for video change
    setTimeout(() => setIsVideoLoading(false), 500);
  };

  const handleVideoProgress = (progress: number) => {
    if (selectedVideo) {
      setCurrentVideoProgress(progress);

      // Update the progress in our local state
      setVideoProgress((prev) => ({
        ...prev,
        [selectedVideo.videoId]: {
          videoId: selectedVideo.videoId,
          progress,
          completed: progress >= 95, // Mark as completed if 95% or more watched
        },
      }));
    }
  };

  const handleVideoEnd = async () => {
    if (!course || !selectedVideo || !account) return;

    try {
      // Mark current video as complete
      setVideoProgress((prev) => ({
        ...prev,
        [selectedVideo.videoId]: {
          videoId: selectedVideo.videoId,
          progress: 100,
          completed: true,
        },
      }));

      // Check if this was the last video in the course
      const allVideosCompleted = course.videos.every(
        (video) => videoProgress[video.videoId]?.completed
      );

      if (allVideosCompleted) {
        // Update streak for course completion
        await updateStreak(account.address, "course_completed", {
          courseId: course.id,
          courseTitle: course.title,
        });
        toast.success("Course completed! 🎉");
      }

      // Find the next video in sequence
      const currentIndex = course.videos.findIndex(
        (v) => v.videoId === selectedVideo.videoId
      );

      if (currentIndex < course.videos.length - 1) {
        // Auto-play next video with a slight delay
        setTimeout(() => {
          handleVideoSelect(course.videos[currentIndex + 1]);
          toast.success("Moving to next video");
        }, 1500);
      }
    } catch (error) {
      console.error("Error handling video end:", error);
      toast.error("Failed to update progress");
    }
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

  const completedVideosCount = Object.values(videoProgress).filter(
    (p) => p.completed
  ).length;
  const courseProgress = Math.round(
    (completedVideosCount / course.videos.length) * 100
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <div className="flex items-center mt-2">
            <div className="w-full max-w-xs bg-gray-200 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${courseProgress}%` }}
              />
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {completedVideosCount}/{course.videos.length} videos
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
              ) : selectedVideo && account ? (
                <YouTubePlayer
                  videoId={selectedVideo.videoId}
                  courseId={course.id}
                  walletId={account?.address}
                  onVideoEnd={handleVideoEnd}
                  onProgress={handleVideoProgress}
                  initialProgress={currentVideoProgress}
                />
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500">Select a video to play</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video Title and Info */}
          {selectedVideo && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold">{selectedVideo.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {selectedVideo.channelTitle}
              </p>
            </div>
          )}
        </div>

        {/* Video List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center">
                <span>Course Content</span>
                <span className="text-sm font-normal text-gray-600">
                  {courseProgress}% Complete
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {course.videos.map((video) => {
                  const progress = videoProgress[video.videoId] || {
                    progress: 0,
                    completed: false,
                  };
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
                        <div className="relative shrink-0 w-24 h-16">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-24 h-16 object-cover rounded bg-gray-100"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling?.classList.remove(
                                "hidden"
                              );
                            }}
                          />
                          <div className="hidden absolute inset-0">
                            <ThumbnailFallback title={video.title} />
                          </div>

                          {/* Progress indicator */}
                          {progress.progress > 0 && !progress.completed && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                              <div
                                className="h-1 bg-blue-500"
                                style={{ width: `${progress.progress}%` }}
                              />
                            </div>
                          )}

                          {/* Completion indicator */}
                          {progress.completed && (
                            <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-0.5">
                              <CheckCircle className="w-3 h-3" />
                            </div>
                          )}

                          {/* Loading indicator */}
                          {selectedVideo?.videoId === video.videoId &&
                            isVideoLoading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                              </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-2">
                            {video.title}
                          </h3>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-gray-500 truncate max-w-[70%]">
                              {video.channelTitle}
                            </p>

                            {/* Video status */}
                            {progress.completed ? (
                              <span className="text-xs text-green-600">
                                Completed
                              </span>
                            ) : progress.progress > 0 ? (
                              <span className="text-xs text-blue-600">
                                {Math.round(progress.progress)}%
                              </span>
                            ) : null}
                          </div>
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
