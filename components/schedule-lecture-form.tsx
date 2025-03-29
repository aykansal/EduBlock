"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { getUserCourses, scheduleNewLecture } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Input 
} from '@/components/ui/input';

interface Course {
  id: number;
  title: string;
  videos: Video[];
}

interface Video {
  id: number;
  videoId: string;
  title: string;
}

const formSchema = z.object({
  courseId: z.string(),
  videoId: z.string(),
  date: z.date(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM)",
  }),
  duration: z.coerce.number().min(15, {
    message: "Duration must be at least 15 minutes",
  }).max(180, {
    message: "Duration must be at most 3 hours",
  })
});

type FormValues = z.infer<typeof formSchema>;

interface ScheduleLectureFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ScheduleLectureForm({ onSuccess, onCancel }: ScheduleLectureFormProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: '',
      videoId: '',
      time: '12:00',
      duration: 60,
    },
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getUserCourses();
        setCourses(coursesData || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);
      
      // Combine date and time
      const dateTime = new Date(values.date);
      const [hours, minutes] = values.time.split(':').map(Number);
      dateTime.setHours(hours, minutes);

      // Format data for API
      const lectureData = {
        courseId: parseInt(values.courseId),
        videoId: values.videoId,
        date: dateTime.toISOString(),
        duration: values.duration,
      };

      await scheduleNewLecture(lectureData);
      onSuccess();
    } catch (error) {
      console.error('Error scheduling lecture:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Update available videos when course changes
  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    form.setValue('courseId', courseId);
    form.setValue('videoId', ''); // Reset video selection
    
    const selectedCourse = courses.find(course => course.id === parseInt(courseId));
    if (selectedCourse) {
      setVideos(selectedCourse.videos || []);
    } else {
      setVideos([]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course</FormLabel>
                <Select
                  onValueChange={(value) => handleCourseChange(value)}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No courses found
                      </SelectItem>
                    ) : (
                      courses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the course containing the lecture
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="videoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video Lecture</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedCourseId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a video" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {videos.length === 0 ? (
                      <SelectItem value="none" disabled>
                        {selectedCourseId ? "No videos found in this course" : "Select a course first"}
                      </SelectItem>
                    ) : (
                      videos.map((video) => (
                        <SelectItem key={video.videoId} value={video.videoId}>
                          {video.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the lecture you want to schedule
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select the date for your lecture
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="HH:MM" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  24-hour format (e.g., 14:30)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={15}
                    max={180}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  How long will you study (15-180 min)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Schedule Lecture
          </Button>
        </div>
      </form>
    </Form>
  );
}
