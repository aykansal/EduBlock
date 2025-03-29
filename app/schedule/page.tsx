"use client";

import { useState, useEffect } from 'react';
import { CalendarClock, Plus, Trash2, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScheduleLectureForm } from '@/components/schedule-lecture-form';
import { getScheduledLectures, deleteScheduledLecture } from '@/lib/api';

interface ScheduledLecture {
  id: number;
  title: string;
  courseTitle: string;
  date: string;
  formattedDate: string;
  duration: string;
  videoId: string;
  courseId: number;
}

export default function SchedulePage() {
  const [lectures, setLectures] = useState<ScheduledLecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadLectures = async () => {
    setIsLoading(true);
    try {
      const data = await getScheduledLectures();
      setLectures(data || []);
    } catch (error) {
      console.error('Error loading scheduled lectures:', error);
      toast.error('Failed to load scheduled lectures');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLectures();
  }, []);

  const handleDeleteLecture = async (id: number) => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      await deleteScheduledLecture(id);
      toast.success('Lecture removed from schedule');
      // Refresh the list
      setLectures(lectures.filter(lecture => lecture.id !== id));
    } catch (error) {
      console.error('Error deleting lecture:', error);
      toast.error('Failed to remove lecture from schedule');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLectureAdded = () => {
    setShowForm(false);
    loadLectures();
    toast.success('Lecture added to schedule');
  };

  const formatLectureDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'EEEE, MMMM d, yyyy - h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-muted-foreground mt-1">
            Plan and manage your learning sessions
          </p>
        </div>
        <Button
          variant="default"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          
          {showForm ? 'Cancel' : 'Schedule Lecture'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Schedule a New Lecture</CardTitle>
            <CardDescription>
              Add a lecture from one of your courses to your personal schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScheduleLectureForm onSuccess={handleLectureAdded} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Upcoming Lectures
          </CardTitle>
          <CardDescription>
            Your scheduled learning sessions for the coming days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : lectures.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>You don't have any scheduled lectures yet.</p>
              <p className="mt-1">Click "Schedule Lecture" to add one to your calendar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lectures.map((lecture) => (
                <div key={lecture.id} className="rounded-lg border p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{lecture.title}</h3>
                      <p className="text-sm text-blue-600">{lecture.courseTitle}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatLectureDate(lecture.date)}
                      </p>
                      <p className="text-sm mt-1">Duration: {lecture.duration}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteLecture(lecture.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
