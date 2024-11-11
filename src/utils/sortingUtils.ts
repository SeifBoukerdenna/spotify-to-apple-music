import {
  SortOptionsArtist,
  BaseSortOptions,
  SortOptionsArtistSpecific,
} from "../enums/sortOption";
import { Track } from "../interfaces/Track.interface";

/**
 * Sorts an array of tracks based on the specified sort option.
 *
 * @param {Track[]} tracks - Array of tracks to sort.
 * @param {SortOptionsArtist} sortOption - The sorting criteria.
 * @returns {Track[]} - Sorted array of tracks.
 */
export const sortTracks = (
  tracks: Track[],
  sortOption: SortOptionsArtist
): Track[] => {
  return tracks.sort((a, b) => {
    if (sortOption === BaseSortOptions.Name) {
      return a.name.localeCompare(b.name);
    } else if (sortOption === SortOptionsArtistSpecific.artist) {
      return a.artists[0].name.localeCompare(b.artists[0].name);
    } else if (sortOption === SortOptionsArtistSpecific.album) {
      return a.album.name.localeCompare(b.album.name);
    }
    return 0;
  });
};
