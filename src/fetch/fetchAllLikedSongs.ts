import axios from "axios";
import { SavedTrackItem } from "../interfaces/SavedTrack.interface";

/**
 * Fetches all liked songs for a user from the Spotify API.
 *
 * This function retrieves all saved tracks from a user's Spotify account
 * by making paginated requests, handling up to 50 tracks per request,
 * and continuing until all tracks are collected.
 *
 * @param {string | null} token - The authentication token for the Spotify API.
 * @throws {Error} If the token is not provided.
 * @returns {Promise<SavedTrackItem[]>} A promise that resolves to an array of liked tracks.
 *
 * @example
 * const token = "your_spotify_token";
 * fetchAllLikedSongs(token)
 *   .then((tracks) => console.log(tracks))
 *   .catch((error) => console.error(error));
 */
export const fetchAllLikedSongs = async (token: string | null) => {
  if (!token) throw new Error("No token available");

  let allTracks: SavedTrackItem[] = [];
  let offset = 0;
  const limit = 50;

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

  return allTracks.map((item) => item.track);
};
