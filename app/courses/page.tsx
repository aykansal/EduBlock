"use client"

import { CoursePlayer } from "@/components/course-player"
import { PlaylistSidebar } from "@/components/playlist-sidebar"
import { useState } from "react"

const videos = [
  { id: 1, title: "Introduction to Smart Contracts", description: "Learn the basics of smart contracts and their applications in blockchain technology.", url: "https://www.youtube.com/embed/ggZneaS4UUc", duration: "10:23", completed: true },
  { id: 2, title: "Setting Up Your Development Environment", description: "Step-by-step guide to set up your blockchain development environment.", url: "https://www.youtube.com/embed/coQ5dg8wM2o", duration: "15:45", completed: false },
  { id: 3, title: "Writing Your First Smart Contract", description: "Hands-on tutorial for writing and deploying your first smart contract.", url: "https://www.youtube.com/embed/ipwxYa-F1uY", duration: "20:18", completed: false },
  { id: 4, title: "Testing and Deploying Smart Contracts", description: "Best practices for testing and safely deploying smart contracts.", url: "https://www.youtube.com/embed/58RStkjsE_Q", duration: "18:32", completed: false },
  { id: 5, title: "Interacting with Smart Contracts", description: "Learn how to interact with deployed smart contracts from your application.", url: "https://www.youtube.com/embed/ZE2HxTmxfrI", duration: "22:10", completed: false },
  { id: 6, title: "Advanced Smart Contract Concepts", description: "Dive deep into advanced concepts and patterns in smart contract development.", url: "https://www.youtube.com/embed/WB-Bq_iqEHc", duration: "25:05", completed: false },
  { id: 7, title: "Security Considerations in Smart Contracts", description: "Understanding common security vulnerabilities and how to prevent them.", url: "https://www.youtube.com/embed/WchXkMlKj9w", duration: "19:47", completed: false },
  { id: 8, title: "Real-world Smart Contract Use Cases", description: "Exploring practical applications of smart contracts in various industries.", url: "https://www.youtube.com/embed/LZJNj-HHfII", duration: "23:59", completed: false },
  { id: 9, title: "Optimizing Gas Costs in Smart Contracts", description: "Techniques to minimize gas costs and optimize smart contract efficiency.", url: "https://www.youtube.com/embed/HQ_8ZdVPXtk", duration: "17:36", completed: false },
  { id: 10, title: "Future of Smart Contracts and Blockchain", description: "Discussing emerging trends and the future of smart contract technology.", url: "https://www.youtube.com/embed/TVuAdQxc1EU", duration: "21:14", completed: false },
]

export default function CoursesPage() {
  const [currentVideo, setCurrentVideo] = useState(videos[1])

  const handleVideoSelect = (video: typeof videos[0]) => {
    setCurrentVideo(video)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex-1 overflow-auto">
        <CoursePlayer currentVideo={currentVideo} />
      </div>
      <PlaylistSidebar 
        videos={videos} 
        currentVideoId={currentVideo.id} 
        onVideoSelect={handleVideoSelect} 
      />
    </div>
  )
}

