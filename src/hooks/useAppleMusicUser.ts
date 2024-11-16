// hooks/useAppleMusicUser.ts
import { useState, useEffect } from "react";
import { useMusicKit } from "./useMusicKit";

interface LibraryStats {
  songs: number;
  playlists: number;
  albums: number;
}

export interface AppleMusicUser {
  storefront: string;
  stats: LibraryStats;
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

  useEffect(() => {
    const fetchUserData = async () => {
      if (!musicKitInstance || !isAuthorized) {
        setIsLoading(false);
        return;
      }

      try {
        // Initialize library stats with default values
        const stats: LibraryStats = {
          songs: 0,
          playlists: 0,
          albums: 0,
        };

        // Get playlists count
        try {
          const playlists = await musicKitInstance.api.library.playlists();
          stats.playlists = playlists.length;
        } catch (e) {
          console.warn("Failed to fetch playlists count:", e);
        }

        // Get songs count if available
        try {
          const songs = await musicKitInstance.api.library.songs.all();
          stats.songs = songs.length;
        } catch (e) {
          console.warn("Failed to fetch songs count:", e);
        }

        // Create user info with available data
        const userInfo: AppleMusicUser = {
          storefront: "us", // Default to 'us' since storefront might not be directly accessible
          stats,
          subscription: {
            isActive: true, // We can assume active if authorized
            type: "Apple Music",
          },
        };

        setUser(userInfo);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [musicKitInstance, isAuthorized]);

  return { user, isLoading, error };
};
