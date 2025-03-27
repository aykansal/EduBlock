"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useThrottle } from "@/hooks/useThrottle";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  RotateCcw,
} from "lucide-react";

// Import the youtube-player dynamically to avoid SSR issues
let YouTubePlayer: any = null;

// Type definitions
interface YouTubePlayerProps {
  videoId: string;
  courseId: number;
  walletId: string;
  onVideoEnd?: () => void;
  onProgress?: (progress: number) => void;
  initialProgress?: number;
}

const YouTubePlayerComponent = ({
  videoId,
  courseId,
  walletId,
  onVideoEnd,
  onProgress,
  initialProgress = 0,
}: YouTubePlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  // Throttle progress updates to reduce API calls
  const throttledProgress = useThrottle(progress, 100);

  // Load the YouTube Player library dynamically
  useEffect(() => {
    const loadYouTubePlayer = async () => {
      if (!YouTubePlayer) {
        YouTubePlayer = (await import("youtube-player")).default;
      }
    };

    loadYouTubePlayer();
  }, []);

  // Initialize the player when the component mounts
  useEffect(() => {
    if (!YouTubePlayer || !playerRef.current) return;

    const playerInstance = YouTubePlayer(playerRef.current, {
      videoId,
      playerVars: {
        autoplay: 0, // Don't autoplay videos
        modestbranding: 1, // Hide YouTube logo
        rel: 0, // Don't show related videos
        showinfo: 0, // Hide video title and uploader
        controls: 0, // Hide video controls - we'll use our own
        disablekb: 0, // Enable keyboard controls
        fs: 1, // Allow fullscreen
        iv_load_policy: 3, // Hide video annotations
        playsinline: 1, // Play inline on mobile devices
        loop: 0, // Don't loop the video
        cc_load_policy: 0, // Hide closed captions by default
        autohide: 1, // Hide video controls when playing
        enablejsapi: 1, // Enable the JavaScript API
        origin: window.location.origin, // Set the origin for security
      },
    });

    playerInstanceRef.current = playerInstance;

    // Set up event listeners
    playerInstance.on("ready", () => {
      setIsReady(true);
      playerInstance.getDuration().then((durationSeconds: number) => {
        setDuration(durationSeconds);

        // If there's initial progress, seek to that position
        if (initialProgress > 0) {
          const seekToTime = (initialProgress / 100) * durationSeconds;
          playerInstance.seekTo(seekToTime, true);
        }

        // Enable skip if video is 45 seconds or longer
        setCanSkip(durationSeconds >= 45);
      });
    });

    playerInstance.on("stateChange", (event: any) => {
      // Video ended
      if (event.data === 0) {
        setProgress(100);
        setIsPlaying(false);

        // Save progress as completed
        saveProgress(100, true);

        if (onVideoEnd) {
          onVideoEnd();
        }
      }

      // Video playing
      if (event.data === 1) {
        setIsPlaying(true);
        setIsTracking(true);
      } else {
        if (event.data === 2) {
          // Paused
          setIsPlaying(false);
        }
        setIsTracking(false);
      }
    });

    return () => {
      if (playerInstanceRef.current) {
        // Save progress before unmounting
        saveProgress(progress);
        playerInstanceRef.current.destroy();
      }
    };
  }, [videoId]);

  // Track video progress while playing
  useEffect(() => {
    if (!isReady || !isTracking) return;

    const interval = setInterval(async () => {
      if (playerInstanceRef.current) {
        const currentTime = await playerInstanceRef.current.getCurrentTime();
        setCurrentTime(currentTime);

        if (duration > 0) {
          const calculatedProgress = Math.min(
            (currentTime / duration) * 100,
            100
          );
          setProgress(calculatedProgress);

          if (onProgress) {
            onProgress(calculatedProgress);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isReady, isTracking, duration]);

  // Save progress to API when throttled progress changes
  useEffect(() => {
    if (throttledProgress > 0) {
      saveProgress(throttledProgress);
    }
  }, [throttledProgress]);

  // Function to save progress to API
  const saveProgress = async (currentProgress: number, completed = false) => {
    try {
      await axios.post("/api/courses/progress", {
        videoId,
        courseId,
        walletId,
        progress: currentProgress,
        completed,
      });
    } catch (error) {
      console.error("Error saving video progress:", error);
    }
  };

  // Player control functions
  const togglePlay = () => {
    if (!playerInstanceRef.current) return;

    if (isPlaying) {
      playerInstanceRef.current.pauseVideo();
    } else {
      playerInstanceRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerInstanceRef.current) return;

    if (isMuted) {
      playerInstanceRef.current.unMute();
      setIsMuted(false);
    } else {
      playerInstanceRef.current.mute();
      setIsMuted(true);
    }
  };

  const enterFullscreen = () => {
    if (!playerRef.current) return;

    const container = playerRef.current.closest(
      ".player-container"
    ) as HTMLElement;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !playerInstanceRef.current || !duration)
      return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = (clickPosition / rect.width) * 100;
    const seekTime = (percentage / 100) * duration;

    playerInstanceRef.current.seekTo(seekTime, true);
    setProgress(percentage);
  };

  const skipForward = () => {
    if (!playerInstanceRef.current) return;

    const newTime = Math.min(currentTime + 10, duration);
    playerInstanceRef.current.seekTo(newTime, true);
  };

  const skipBackward = () => {
    if (!playerInstanceRef.current) return;

    const newTime = Math.max(currentTime - 10, 0);
    playerInstanceRef.current.seekTo(newTime, true);
  };

  return (
    <div className="relative w-full player-container">
      {/* YouTube Player */}
      <div
        ref={playerRef}
        className="w-full aspect-video rounded-lg overflow-hidden"
      />

      {/* Custom Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity duration-300 hover:opacity-100 opacity-0 hover:opacity-100 group">
        {/* Progress Bar */}
        <div
          ref={progressBarRef}
          className="w-full h-3 bg-gray-200/50 rounded-full mb-2 cursor-pointer relative"
          onClick={seekTo}
        >
          {/* Progress Indicator */}
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
          {/* Hover Effect */}
          <div className="absolute top-0 left-0 w-full h-full rounded-full hover:bg-white/10" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center space-x-3">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* Skip Backward Button */}
            <button
              onClick={skipBackward}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label="Skip backward 10 seconds"
            >
              <RotateCcw size={16} />
            </button>

            {/* Skip Forward Button */}
            <button
              onClick={skipForward}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label="Skip forward 10 seconds"
            >
              <SkipForward size={16} />
            </button>

            {/* Volume Button */}
            <button
              onClick={toggleMute}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            {/* Time Display */}
            <div className="text-white text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Right Controls */}
          <div>
            {/* Fullscreen Button */}
            <button
              onClick={enterFullscreen}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label="Enter fullscreen"
            >
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time in MM:SS format
const formatTime = (seconds: number): string => {
  if (!seconds) return "00:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export default YouTubePlayerComponent;
