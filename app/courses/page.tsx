"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import axios from "axios";

const YoutubePlaylist = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState<string>("");

  const extractPlaylistId = (url: string) => {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      const playlistId = params.get("list");
      return playlistId;
    } catch (error) {
      return null;
    }
  };

  const fetchPlaylistData = async (e: any) => {
    e.preventDefault();
    const playlistId = extractPlaylistId(url);
    if (!playlistId) {
      setError("Invalid YouTube playlist URL. Please enter a valid URL.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `/api/courses/add?playlistId=${playlistId}`
      );
      if (!response) throw new Error("Failed to fetch playlist data");
      const data = await response.data;
      console.log(data.videos);
      setVideos(data.videos);
    } catch (err: any) {
      setError(err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto p-4 w-full max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>YouTube Playlist Viewer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={fetchPlaylistData} className="mb-6">
            <div className="flex sm:flex-row flex-col gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter YouTube playlist URL"
                className="flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 px-6 py-2 rounded text-white transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex justify-center items-center">
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Load Playlist"
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 mb-4 p-4 rounded text-red-500">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {videos.map((video: any) => (
              <div
                key={video.videoId}
                className="hover:bg-gray-50 p-4 border rounded-lg transition-colors"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="rounded"
                  />
                  <div>
                    <h3 className="font-medium text-lg">{video.title}</h3>
                    <p className="text-gray-600">{video.channelTitle}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YoutubePlaylist;
