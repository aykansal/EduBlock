import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge, Clock, Users } from 'lucide-react'

const courses = [
  {
    id: 1,
    title: "Introduction to Blockchain",
    description: "Learn the fundamentals of blockchain technology and its applications.",
    instructor: "Dr. Sarah Johnson",
    duration: "4 weeks",
    students: 1500,
    difficulty: "Beginner",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Smart Contracts Development",
    description: "Master the art of writing and deploying smart contracts on Ethereum.",
    instructor: "Prof. Michael Lee",
    duration: "6 weeks",
    students: 1200,
    difficulty: "Intermediate",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Cryptography and Blockchain Security",
    description: "Dive deep into the cryptographic principles behind blockchain security.",
    instructor: "Dr. Emily Chen",
    duration: "5 weeks",
    students: 800,
    difficulty: "Advanced",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Decentralized Finance (DeFi)",
    description: "Explore the world of decentralized finance and its impact on traditional banking.",
    instructor: "Prof. David Brown",
    duration: "7 weeks",
    students: 2000,
    difficulty: "Intermediate",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Blockchain for Business",
    description: "Learn how to implement blockchain solutions in various business sectors.",
    instructor: "Dr. Rachel Green",
    duration: "5 weeks",
    students: 1800,
    difficulty: "Beginner",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Advanced Blockchain Scalability",
    description: "Tackle the challenges of blockchain scalability with cutting-edge solutions.",
    instructor: "Prof. Alex Turner",
    duration: "8 weeks",
    students: 600,
    difficulty: "Advanced",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export function CoursesGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id} className="flex flex-col">
          <CardHeader>
            <img src={course.image} alt={course.title} className="w-full h-48 object-cover rounded-t-lg" />
            <CardTitle className="mt-4">{course.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-gray-600 mb-4">{course.description}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <Clock size={16} />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <Users size={16} />
              <span>{course.students} students</span>
            </div>
            <Badge fontVariant={course.difficulty === "Beginner" ? "default" : course.difficulty === "Intermediate" ? "secondary" : "destructive"}>
              {course.difficulty}
            </Badge>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <p className="text-sm font-medium">Instructor: {course.instructor}</p>
            <Button>Enroll</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

