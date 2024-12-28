import { Metadata } from 'next'
import ProgressDashboard from '@/components/ProgressDashboard'
import { getUserProgress } from '@/lib/api'
// import { getUserProgress } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Progress Dashboard',
  description: 'Track your learning progress and explore new courses',
}

export default async function ProgressPage() {
  const userProgress = await getUserProgress()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Learning Progress</h1>
      <ProgressDashboard progress={userProgress} />
    </div>
  )
}

