import { Progress } from '@/components/ui/progress'

interface DailyTargetProps {
  target: {
    sessionsCompleted: number;
    totalSessions: number;
    sessionDuration: number;
    breakDuration: number;
  }
}

export default function DailyTarget({ target }: DailyTargetProps) {
  const progress = (target.sessionsCompleted / target.totalSessions) * 100

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Daily Target</h2>
      <Progress value={progress} className="w-full h-2 mb-2" />
      <p className="text-sm text-gray-600">
        {target.sessionsCompleted} of {target.totalSessions} sessions completed
      </p>
      <p className="text-sm text-gray-600">
        Session duration: {target.sessionDuration} minutes
      </p>
      <p className="text-sm text-gray-600">
        Break duration: {target.breakDuration} minutes
      </p>
    </div>
  )
}

