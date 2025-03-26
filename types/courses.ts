export interface Thumbnails {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
    standard: { url: string; width: number; height: number };
    maxres: { url: string; width: number; height: number };
}

export interface Snippet {
    publishedAt: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    position: number;
    channelId: string;
    resourceId: {
        kind: string;
        videoId: string;
    };
    playlistId: string;
}

export interface ContentDetails {
    videoId: string;
    videoPublishedAt: string;
}

export interface Item {
    kind: string;
    etag: string;
    id: string;
    snippet: Snippet;
    contentDetails: ContentDetails;
}

export interface PlaylistItemListResponse {
    kind: string;
    etag: string;
    nextPageToken: string;
    items: Item[];
    pageInfo: { totalResults: number; resultsPerPage: number };
}

export interface Video {
    videoId: string;
    title: string;
    thumbnail: string;
    position: number;
    channelTitle: string;
    channelId: string;
    playlistId: string;
}

export interface Course {
    id: number;
    playlistId: string;
    title: string;
    videos: Video[];
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    videoCount: number;
}

export interface Item {
    Snippet: {
        resourceId: {
            videoId: string;
        };
        title: string;
        thumbnails: {
            default: {
                url: string;
            };
        };
        position: number;
        channelTitle: string;
        channelId: string;
        playlistId: string;
    };
}

export interface PlaylistItemListResponse {
    items: Item[];
    nextPageToken: string;
}