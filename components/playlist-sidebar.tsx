import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaySquare, CheckSquare } from "lucide-react";

interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  duration: string;
  completed: boolean;
}

interface PlaylistSidebarProps {
  videos: Video[];
  currentVideoId: number;
  onVideoSelect: (video: Video) => void;
}

export function PlaylistSidebar({
  videos,
  currentVideoId,
  onVideoSelect,
}: PlaylistSidebarProps) {
  return (
    <div className="w-80 border-l border-border bg-muted/30">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">Blockchain Fundamentals</h2>
        <p className="text-sm text-muted-foreground">
          {videos.length} lessons • 3h 15m total length
        </p>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="p-4 space-y-2">
          {videos.map(
            (video) =>
              video.id !== 1 && (
                <div
                  key={video.id}
                  className={`flex items-start space-x-2 p-2 rounded-md hover:bg-muted cursor-pointer ${
                    video.id === currentVideoId ? "bg-muted" : ""
                  }`}
                  onClick={() => onVideoSelect(video)}
                >
                  {video.completed ? (
                    <CheckSquare className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  ) : (
                    <PlaySquare className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium leading-none ${
                        video.id === currentVideoId ? "text-primary" : ""
                      }`}
                    >
                      {video.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {video.duration}
                    </p>
                  </div>
                </div>
              )
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
