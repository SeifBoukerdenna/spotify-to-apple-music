// hooks/useTrackSearch.ts
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Track } from "../interfaces/Track.interface";
import axios from "axios";

export const useTrackSearch = (token: string | null) => {
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchTracks = async () => {
      if (!debouncedSearchTerm.trim() || !token) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            debouncedSearchTerm
          )}&type=track&limit=20`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSearchResults(response.data.tracks.items);
      } catch (error) {
        console.error("Error searching tracks:", error);
        setError("Failed to search tracks");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchTracks();
  }, [debouncedSearchTerm, token]);

  return {
    searchResults,
    isSearching,
    searchTerm,
    setSearchTerm,
    error,
  };
};
