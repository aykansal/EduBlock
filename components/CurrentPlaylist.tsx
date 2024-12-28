import Link from 'next/link'
import Image from 'next/image'
import { Progress } from '@/components/ui/progress'
import { Playlist } from '@/types/playlist'
// import { Playlist } from '@/types/playlist'

interface CurrentPlaylistProps {
  playlist: Playlist
}

export default function CurrentPlaylist({ playlist }: CurrentPlaylistProps) {
  const progress = (playlist.completedVideos / playlist.totalVideos) * 100

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Current Playlist</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <Link href={`/courses/${playlist.id}`} className="block group md:w-1/2">
          <div className="relative aspect-video mb-2">
            <Image
              src={playlist.thumbnailUrl}
              alt={playlist.title}
              fill
              className="object-cover rounded-md"
            />
          </div>
        </Link>
        <div className="md:w-1/2">
          <Link href={`/courses/${playlist.id}`} className="block group">
            <h3 className="text-xl font-medium group-hover:text-blue-600 transition-colors mb-2">
              {playlist.title}
            </h3>
          </Link>
          <Progress value={progress} className="w-full h-2 mb-2" />
          <p className="text-sm text-gray-600 mb-4">
            {playlist.completedVideos} of {playlist.totalVideos} videos completed
          </p>
          <Link 
            href={`/courses/${playlist.id}`} 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue Learning
          </Link>
        </div>
      </div>
    </div>
  )
}

