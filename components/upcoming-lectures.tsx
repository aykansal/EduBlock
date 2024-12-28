import { CalendarDays } from 'lucide-react'

const lectures = [
  { id: 1, title: "Introduction to Smart Contracts", date: "Today, 2:00 PM", duration: "1 hour" },
  { id: 2, title: "Cryptography in Blockchain", date: "Tomorrow, 10:00 AM", duration: "1.5 hours" },
  { id: 3, title: "Decentralized Applications (DApps)", date: "Wed, 3:00 PM", duration: "2 hours" },
  { id: 4, title: "Blockchain Scalability Solutions", date: "Thu, 11:00 AM", duration: "1 hour" },
  { id: 5, title: "Tokenomics and Cryptocurrency", date: "Fri, 1:00 PM", duration: "1.5 hours" },
]

export function UpcomingLectures() {
  return (
    <div className="space-y-4">
      {lectures.map((lecture) => (
        <div key={lecture.id} className="flex items-center space-x-4">
          <CalendarDays className="h-5 w-5 text-blue-500" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{lecture.title}</p>
            <p className="text-sm text-muted-foreground">{lecture.date}</p>
          </div>
          <div className="text-sm text-muted-foreground">{lecture.duration}</div>
        </div>
      ))}
    </div>
  )
}

