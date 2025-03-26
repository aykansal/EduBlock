"use client"

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useThrottle } from '@/hooks/useThrottle'

// Import the youtube-player dynamically to avoid SSR issues
let YouTubePlayer: any = null

// Type definitions
interface YouTubePlayerProps {
  videoId: string
  courseId: number
  walletId: string
  onVideoEnd?: () => void
  onProgress?: (progress: number) => void
  initialProgress?: number
}

const YouTubePlayerComponent = ({
  videoId,
  courseId,
  walletId,
  onVideoEnd,
  onProgress,
  initialProgress = 0
}: YouTubePlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null)
  const playerInstanceRef = useRef<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isTracking, setIsTracking] = useState(false)
  
  // Throttle progress updates to reduce API calls
  const throttledProgress = useThrottle(progress, 5000)

  // Load the YouTube Player library dynamically
  useEffect(() => {
    const loadYouTubePlayer = async () => {
      if (!YouTubePlayer) {
        YouTubePlayer = (await import('youtube-player')).default
      }
    }
    
    loadYouTubePlayer()
  }, [])

  // Initialize the player when the component mounts
  useEffect(() => {
    if (!YouTubePlayer || !playerRef.current) return

    const playerInstance = YouTubePlayer(playerRef.current, {
      videoId,
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
      },
    })

    playerInstanceRef.current = playerInstance

    // Set up event listeners
    playerInstance.on('ready', () => {
      setIsReady(true)
      playerInstance.getDuration().then((durationSeconds: number) => {
        setDuration(durationSeconds)
        
        // If there's initial progress, seek to that position
        if (initialProgress > 0) {
          const seekToTime = (initialProgress / 100) * durationSeconds
          playerInstance.seekTo(seekToTime, true)
        }
      })
    })

    playerInstance.on('stateChange', (event: any) => {
      // Video ended
      if (event.data === 0) {
        setProgress(100)
        
        // Save progress as completed
        saveProgress(100, true)
        
        if (onVideoEnd) {
          onVideoEnd()
        }
      }
      
      // Video playing
      if (event.data === 1) {
        setIsTracking(true)
      } else {
        setIsTracking(false)
      }
    })

    return () => {
      if (playerInstanceRef.current) {
        // Save progress before unmounting
        saveProgress(progress)
        playerInstanceRef.current.destroy()
      }
    }
  }, [videoId])

  // Track video progress while playing
  useEffect(() => {
    if (!isReady || !isTracking) return

    const interval = setInterval(async () => {
      if (playerInstanceRef.current) {
        const currentTime = await playerInstanceRef.current.getCurrentTime()
        setCurrentTime(currentTime)
        
        if (duration > 0) {
          const calculatedProgress = Math.min((currentTime / duration) * 100, 100)
          setProgress(calculatedProgress)
          
          if (onProgress) {
            onProgress(calculatedProgress)
          }
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isReady, isTracking, duration])

  // Save progress to API when throttled progress changes
  useEffect(() => {
    if (throttledProgress > 0) {
      saveProgress(throttledProgress)
    }
  }, [throttledProgress])

  // Function to save progress to API
  const saveProgress = async (currentProgress: number, completed = false) => {
    try {
      await axios.post('/api/courses/progress', {
        videoId,
        courseId,
        walletId,
        progress: currentProgress,
        completed
      })
    } catch (error) {
      console.error('Error saving video progress:', error)
    }
  }

  return (
    <div className="relative w-full">
      <div ref={playerRef} className="w-full aspect-video" />
      
      {/* Optional progress indicator */}
      <div className="w-full bg-gray-200 h-1 mt-1">
        <div 
          className="bg-blue-500 h-1" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  )
}

export default YouTubePlayerComponent 