import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const extractPlaylistId = (url: string) => {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const playlistId = params.get("list");
    return playlistId;
  } catch (error) {
    return null;
  }
};