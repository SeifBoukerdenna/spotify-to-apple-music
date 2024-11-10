// src/utils/fetchAllPlaylistTracks.ts
import axios from "axios";
import { PlaylistTrack } from "../interfaces/PlaylistTrack.interface";

export const fetchAllPlaylistTracks = async (
  playlistId: string,
  token: string | null
) => {
  if (!token) throw new Error("No token available");

  let allTracks: PlaylistTrack[] = [];
  let offset = 0;
  const limit = 100; // Maximum allowed by Spotify API

  while (true) {
    const response = await axios.get<{
      items: PlaylistTrack[];
      next: string | null;
      total: number;
    }>(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    allTracks = allTracks.concat(response.data.items);

    if (!response.data.next) {
      break;
    }

    offset += limit;
  }

  return allTracks;
};
