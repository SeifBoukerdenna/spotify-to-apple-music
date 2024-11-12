import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { SavedTrackItem } from "../interfaces/SavedTrack.interface";
import { Track } from "../interfaces/Track.interface";
import { useSpotifyInfiniteQuery } from "./useSpotifyInfiniteQuery";

export const useLikedSongs = (token: string | null) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [sortOption, setSortOption] = useState<
    "name" | "artist" | "album" | "none"
  >("none");

  const processSavedTracks = (items: SavedTrackItem[]) =>
    items.map((item) => item.track);

  const infiniteQueryResult = useSpotifyInfiniteQuery<SavedTrackItem, Track>(
    token,
    "https://api.spotify.com/v1/me/tracks",
    "likedSongs",
    20,
    !!token,
    0,
    processSavedTracks
  );

  const {
    items: likedSongs,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = infiniteQueryResult;

  useEffect(() => {
    if (
      !isLoading &&
      !isFetchingNextPage &&
      hasNextPage &&
      debouncedSearchTerm
    ) {
      const filteredSongs = likedSongs.filter(
        (track) =>
          track.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          track.artists.some((artist) =>
            artist.name
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase())
          ) ||
          track.album.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
      );

      if (filteredSongs.length === 0) {
        fetchNextPage();
      }
    }
  }, [
    debouncedSearchTerm,
    likedSongs,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  ]);

  const getFilteredAndSortedTracks = () => {
    return likedSongs
      .filter(
        (track) =>
          track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          track.artists.some((artist) =>
            artist.name.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          track.album.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOption === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortOption === "artist") {
          return a.artists[0].name.localeCompare(b.artists[0].name);
        } else if (sortOption === "album") {
          return a.album.name.localeCompare(b.album.name);
        }
        return 0;
      });
  };

  return {
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    likedSongs: getFilteredAndSortedTracks(),
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
