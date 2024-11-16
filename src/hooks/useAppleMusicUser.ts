// hooks/useAppleMusicUser.ts
import { useState, useCallback } from "react";
import { useMusicKit } from "./useMusicKit";

export interface AppleMusicUser {
  id: string;
  storefront: string;
  name: string;
  imageUrl?: string;
  stats: {
    songs: number;
    playlists: number;
    albums: number;
  };
  subscription: {
    isActive: boolean;
    type: string;
  };
}

export const useAppleMusicUser = () => {
  const { musicKitInstance, isAuthorized } = useMusicKit();
  const [user, setUser] = useState<AppleMusicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!musicKitInstance || !isAuthorized) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [songsResponse, playlistsResponse, albumsResponse] =
        await Promise.all([
          fetch("https://api.music.apple.com/v1/me/library/songs?limit=1", {
            headers: {
              Authorization: `Bearer ${musicKitInstance.developerToken}`,
              "Music-User-Token": musicKitInstance.musicUserToken,
            },
          }),
          fetch("https://api.music.apple.com/v1/me/library/playlists?limit=1", {
            headers: {
              Authorization: `Bearer ${musicKitInstance.developerToken}`,
              "Music-User-Token": musicKitInstance.musicUserToken,
            },
          }),
          fetch("https://api.music.apple.com/v1/me/library/albums?limit=1", {
            headers: {
              Authorization: `Bearer ${musicKitInstance.developerToken}`,
              "Music-User-Token": musicKitInstance.musicUserToken,
            },
          }),
        ]);

      // Process all responses in parallel
      const [songsData, playlistsData, albumsData] = await Promise.all([
        songsResponse.ok ? songsResponse.json() : { meta: { total: 0 } },
        playlistsResponse.ok
          ? playlistsResponse.json()
          : { meta: { total: 0 } },
        albumsResponse.ok ? albumsResponse.json() : { meta: { total: 0 } },
      ]);

      let userName = "Apple Music User";
      try {
        const storedName = localStorage.getItem("apple_music_name");
        if (storedName) {
          userName = storedName;
        }
      } catch (err) {
        console.error("Error getting user name:", err);
      }

      const userInfo: AppleMusicUser = {
        id: musicKitInstance.musicUserToken,
        storefront: musicKitInstance.api.storefronts.currentStorefront || "us",
        name: userName,
        imageUrl:
          localStorage.getItem("apple_music_profile_image") || undefined,
        stats: {
          songs: songsData.meta?.total || 0,
          playlists: playlistsData.meta?.total || 0,
          albums: albumsData.meta?.total || 0,
        },
        subscription: {
          isActive: true,
          type: "Apple Music",
        },
      };

      setUser(userInfo);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load user information"
      );
    } finally {
      setIsLoading(false);
    }
  }, [musicKitInstance, isAuthorized]);

  // Export the refetch function to allow manual refetching
  const refetch = useCallback(() => {
    return fetchUserData();
  }, [fetchUserData]);

  // Initial fetch
  useCallback(() => {
    if (isAuthorized && musicKitInstance) {
      fetchUserData();
    }
  }, [isAuthorized, musicKitInstance, fetchUserData]);

  return { user, isLoading, error, refetch };
};
