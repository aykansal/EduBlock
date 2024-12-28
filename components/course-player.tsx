import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThumbsUp, MessageSquare, Share2 } from 'lucide-react'

interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
}

interface CoursePlayerProps {
  currentVideo: Video;
}

export function CoursePlayer({ currentVideo }: CoursePlayerProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="aspect-video bg-muted mb-4">
        <iframe 
          width="100%" 
          height="100%" 
          src={currentVideo.url}
          title={currentVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        />
      </div>
      <h1 className="text-2xl font-bold mb-2">{currentVideo.title}</h1>
      <div className="flex items-center justify-between mb-4">
        <p className="text-muted-foreground">Part of Blockchain Fundamentals</p>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <ThumbsUp className="mr-2 h-4 w-4" />
            Like
          </Button>
          <Button variant="ghost" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            Comment
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      <Progress value={33} className="mb-4" />
      <p className="text-sm text-muted-foreground mb-6">33% complete</p>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Video Overview</CardTitle>
              <CardDescription>{currentVideo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>In this lesson, we'll cover:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Key concepts related to {currentVideo.title}</li>
                <li>Practical applications in blockchain technology</li>
                <li>Common challenges and solutions</li>
                <li>Best practices and industry standards</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transcript">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The transcript for this lesson will be available here once it has been processed and reviewed. In the meantime, you can use the video controls to navigate through the content and revisit key points.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                <li><a href="#" className="text-blue-500 hover:underline">Related whitepaper</a></li>
                <li><a href="#" className="text-blue-500 hover:underline">Official documentation</a></li>
                <li><a href="#" className="text-blue-500 hover:underline">Community forum discussion</a></li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

