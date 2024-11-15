// hooks/usePlaylistManagement.ts
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Playlist } from "../interfaces/Playlist.interface";
import { useSpotifyInfiniteQuery } from "./useSpotifyInfiniteQuery";

export const usePlaylistManagement = (token: string | null) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [sortOption, setSortOption] = useState<"name" | "tracks" | "none">(
    "none"
  );
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([]);

  const {
    items: playlists,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSpotifyInfiniteQuery<Playlist, Playlist>(
    token,
    "https://api.spotify.com/v1/me/playlists",
    "playlists",
    50,
    !!token,
    0
  );

  // Filter and sort playlists based on search term and sort option
  useEffect(() => {
    let result = [...playlists];

    // Filter based on search term
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter((playlist) =>
        playlist.name.toLowerCase().includes(searchLower)
      );
    }

    // Sort based on selected option
    if (sortOption !== "none") {
      result.sort((a, b) => {
        if (sortOption === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortOption === "tracks") {
          return b.tracks.total - a.tracks.total;
        }
        return 0;
      });
    }

    setFilteredPlaylists(result);
  }, [playlists, debouncedSearchTerm, sortOption]);

  // Load more results if search returns few results
  useEffect(() => {
    if (
      !isLoading &&
      !isFetchingNextPage &&
      hasNextPage &&
      debouncedSearchTerm &&
      filteredPlaylists.length < 10
    ) {
      fetchNextPage();
    }
  }, [
    debouncedSearchTerm,
    filteredPlaylists.length,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  ]);

  return {
    playlists: filteredPlaylists,
    allPlaylists: playlists,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    hasMore: hasNextPage,
    isLoadingMore: isFetchingNextPage,
    loadMore: fetchNextPage,
  };
};
