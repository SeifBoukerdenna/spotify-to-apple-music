import axios from "axios";
import { PlaylistTrack } from "../interfaces/PlaylistTrack.interface";

/**
 * Fetches all tracks from a specified Spotify playlist.
 *
 * This function retrieves all tracks in a playlist by making paginated requests to the Spotify API.
 * Each request retrieves up to 100 tracks, continuing until all tracks are collected.
 *
 * @param {string} playlistId - The unique identifier of the Spotify playlist.
 * @param {string | null} token - The authentication token for the Spotify API.
 * @throws {Error} If the token is not provided.
 * @returns {Promise<PlaylistTrack[]>} A promise that resolves to an array of tracks in the playlist.
 *
 * @example
 * const playlistId = "your_playlist_id";
 * const token = "your_spotify_token";
 * fetchAllPlaylistTracks(playlistId, token)
 *   .then((tracks) => console.log(tracks))
 *   .catch((error) => console.error(error));
 */
export const fetchAllPlaylistTracks = async (
  playlistId: string,
  token: string | null
): Promise<PlaylistTrack[]> => {
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
