import { CheckCircle2, XCircle } from 'lucide-react'

const activities = [
  { id: 1, title: "Completed Lecture: Blockchain Basics", type: "completion", date: "2 hours ago" },
  { id: 2, title: "Earned 50 EDT", type: "reward", date: "1 day ago" },
  { id: 3, title: "Missed Quiz: Smart Contracts", type: "missed", date: "2 days ago" },
  { id: 4, title: "Completed Assignment: Cryptography", type: "completion", date: "3 days ago" },
  { id: 5, title: "Earned 25 EDT", type: "reward", date: "4 days ago" },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-4">
          {activity.type === "completion" || activity.type === "reward" ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.title}</p>
            <p className="text-sm text-muted-foreground">{activity.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

