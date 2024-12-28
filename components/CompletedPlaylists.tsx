import Link from 'next/link'
import Image from 'next/image'
import { Playlist } from '@/types/playlist'
// import { Playlist } from '@/types/playlist'

interface CompletedPlaylistsProps {
  playlists: Playlist[]
}

export default function CompletedPlaylists({ playlists }: CompletedPlaylistsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Completed Playlists</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
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
    </div>
  )
}

