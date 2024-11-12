// hooks/usePlaylistDetails.ts
import { useState, useEffect } from "react";
import { Playlist } from "../interfaces/Playlist.interface";
import { Track } from "../interfaces/Track.interface";
import { PlaylistTrack } from "../interfaces/PlaylistTrack.interface";
import axios from "axios";

export const usePlaylistDetails = (
  token: string | null,
  playlistId: string | undefined
) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlistInfo, setPlaylistInfo] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      if (!token || !playlistId) return;

      try {
        const playlistResponse = await axios.get<
          {
            tracks: { items: PlaylistTrack[] };
          } & Playlist
        >(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPlaylistInfo(playlistResponse.data);
        setTracks(playlistResponse.data.tracks.items.map((item) => item.track));
      } catch (error) {
        console.error("Error fetching playlist data:", error);
        setError("Failed to load playlist data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylistData();
  }, [token, playlistId]);

  return {
    tracks,
    playlistInfo,
    isLoading,
    error,
  };
};
