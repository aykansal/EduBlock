// import { UserProgress } from '@/types/playlist'
import CurrentPlaylist from './CurrentPlaylist'
import CompletedPlaylists from './CompletedPlaylists'
import RecommendedPlaylists from './RecommendedPlaylists'
import DailyTarget from './DailyTarget'
import { UserProgress } from '@/types/playlist'

interface ProgressDashboardProps {
  progress: UserProgress
}

export default function ProgressDashboard({ progress }: ProgressDashboardProps) {
  return (
    <div className="space-y-8">
      <DailyTarget target={progress.dailyTarget} />
      <CurrentPlaylist playlist={progress.currentPlaylist} />
      <CompletedPlaylists playlists={progress.completedPlaylists} />
      <RecommendedPlaylists playlists={progress.recommendedPlaylists} />
    </div>
  )
}

