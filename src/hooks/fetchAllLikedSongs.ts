// src/utils/fetchAllLikedSongs.ts
import axios from "axios";
import { SavedTrackItem } from "../interfaces/SavedTrack.interface";

export const fetchAllLikedSongs = async (token: string | null) => {
  if (!token) throw new Error("No token available");

  let allTracks: SavedTrackItem[] = [];
  let offset = 0;
  const limit = 50; // Maximum allowed by Spotify API

  while (true) {
    const response = await axios.get<{
      items: SavedTrackItem[];
      next: string | null;
      total: number;
    }>(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    allTracks = allTracks.concat(response.data.items);

    if (!response.data.next) {
      break;
    }

    offset += limit;
  }

  // Map to only track metadata if needed
  return allTracks.map((item) => item.track);
};
