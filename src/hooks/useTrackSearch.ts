import { useState, useCallback } from "react";
import { Track } from "../interfaces/Track.interface";
import axios from "axios";

export const useTrackSearch = (token: string | null) => {
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim() || !token) return;

      setIsSearching(true);
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSearchResults(response.data.tracks.items);
      } catch (error) {
        console.error("Error searching tracks:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [token]
  );

  return {
    searchResults,
    isSearching,
    handleSearch,
  };
};
