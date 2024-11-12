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

  useEffect(() => {
    if (
      !isLoading &&
      !isFetchingNextPage &&
      hasNextPage &&
      debouncedSearchTerm
    ) {
      const filteredPlaylists = playlists.filter((playlist) =>
        playlist.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );

      if (filteredPlaylists.length === 0) {
        fetchNextPage();
      }
    }
  }, [
    debouncedSearchTerm,
    playlists,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  ]);

  return {
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    playlists,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
