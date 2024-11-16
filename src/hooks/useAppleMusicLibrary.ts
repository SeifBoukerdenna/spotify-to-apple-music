// hooks/useAppleMusicLibrary.ts
import { useState, useEffect } from "react";
import { useMusicKit } from "./useMusicKit";

export interface AppleMusicTrack {
  id: string;
  attributes: {
    name: string;
    artistName: string;
    albumName: string;
    artwork: {
      url: string;
      width: number;
      height: number;
    };
    playParams: {
      id: string;
      kind: string;
    };
    releaseDate?: string;
    trackNumber?: number;
  };
}

export interface AppleMusicPlaylist {
  id: string;
  attributes: {
    name: string;
    description?: {
      standard: string;
    };
    artwork?: {
      url: string;
      width: number;
      height: number;
    };
    hasCatalog: boolean;
    hasLibrary: boolean;
    isPublic: boolean;
    canEdit: boolean;
  };
  relationships?: {
    tracks: {
      data: AppleMusicTrack[];
      meta: {
        total: number;
      };
    };
  };
}

export const useAppleMusicLibrary = () => {
  const { musicKitInstance, isAuthorized } = useMusicKit();
  const [playlists, setPlaylists] = useState<
    MusicKit.Resource<MusicKit.PlaylistAttributes>[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      if (!musicKitInstance || !isAuthorized) return;

      try {
        const response = await musicKitInstance.api.library.playlists();
        setPlaylists(response);
      } catch (err) {
        setError("Failed to fetch library data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibrary();
  }, [musicKitInstance, isAuthorized]);

  const getPlaylistTrackCount = (
    playlist: MusicKit.Resource<MusicKit.PlaylistAttributes>
  ): number => {
    return playlist.attributes.trackCount || 0;
  };

  return {
    playlists,
    isLoading,
    error,
    getPlaylistTrackCount,
    musicKitInstance,
  };
};
