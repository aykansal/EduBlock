"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Playlist } from '@/types/playlist'
// import { Playlist } from '@/types/playlist'

interface RecommendedPlaylistsProps {
  playlists: Playlist[]
}

export default function RecommendedPlaylists({ playlists }: RecommendedPlaylistsProps) {
  const [displayCount, setDisplayCount] = useState(3)

  const handleShowMore = () => {
    setDisplayCount(prevCount => prevCount + 3)
    // In a real application, you would fetch more playlists here if needed
    // For example: if (displayCount + 3 > playlists.length) fetchMorePlaylists()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Recommended Playlists</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.slice(0, displayCount).map((playlist) => (
          <Link key={playlist.id} href={`/courses/${playlist.id}`} className="block group">
            <div className="relative aspect-video mb-2">
              <Image
                src={playlist.thumbnailUrl}
                alt={playlist.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <h3 className="text-lg font-medium group-hover:text-blue-600 transition-colors">
              {playlist.title}
            </h3>
            <p className="text-sm text-gray-600">
              {playlist.totalVideos} videos
            </p>
          </Link>
        ))}
      </div>
      {displayCount < playlists.length && (
        <div className="mt-6 text-center">
          <Button 
            onClick={handleShowMore}
            variant="outline"
            className="inline-flex items-center"
          >
            Show More
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

