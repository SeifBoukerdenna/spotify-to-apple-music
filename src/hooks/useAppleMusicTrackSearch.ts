// hooks/useAppleMusicTrackSearch.ts
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useMusicKit } from "./useMusicKit";

export type AppleMusicTrackSearchResult =
  MusicKit.Resource<MusicKit.TrackAttributes>;

export const useAppleMusicTrackSearch = () => {
  const { musicKitInstance, isAuthorized, isInitialized } = useMusicKit();
  const [searchResults, setSearchResults] = useState<
    AppleMusicTrackSearchResult[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchTracks = async () => {
      if (
        !debouncedSearchTerm.trim() ||
        !musicKitInstance ||
        !isAuthorized ||
        !isInitialized
      ) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        // Format the search term for the URL (replace spaces with +)
        const formattedTerm = encodeURIComponent(debouncedSearchTerm.trim());
        const storefront =
          musicKitInstance.api.storefronts.currentStorefront || "us";

        // Construct the search URL
        const searchUrl = `/v1/catalog/${storefront}/search?term=${formattedTerm}&types=songs&limit=20`;

        // Make the API request
        const response = await fetch(
          `https://api.music.apple.com${searchUrl}`,
          {
            headers: {
              Authorization: `Bearer ${musicKitInstance.developerToken}`,
              "Music-User-Token": musicKitInstance.musicUserToken,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.results?.songs?.data) {
          setSearchResults(data.results.songs.data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error searching tracks:", error);
        setError("Failed to search tracks");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchTracks();
  }, [debouncedSearchTerm, musicKitInstance, isAuthorized, isInitialized]);

  return {
    searchResults,
    isSearching,
    searchTerm,
    setSearchTerm,
    error,
  };
};
