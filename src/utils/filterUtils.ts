// filterUtils.ts

import { Track } from "../interfaces/Track.interface";

/**
 * Filters an array of tracks based on a search term.
 *
 * @param {Track[]} tracks - Array of tracks to filter.
 * @param {string} searchTerm - The search term to filter tracks by.
 * @returns {Track[]} - Filtered array of tracks.
 */
export const filterTracks = (tracks: Track[], searchTerm: string): Track[] => {
  const lowercasedSearchTerm = searchTerm.toLowerCase();
  return tracks.filter(
    (track) =>
      track.name.toLowerCase().includes(lowercasedSearchTerm) ||
      track.artists.some((artist) =>
        artist.name.toLowerCase().includes(lowercasedSearchTerm)
      ) ||
      track.album.name.toLowerCase().includes(lowercasedSearchTerm)
  );
};
