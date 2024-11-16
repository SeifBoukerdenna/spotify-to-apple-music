// hooks/useAppleMusicPlaylistCreation.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMusicKit } from "./useMusicKit";
import type { AppleMusicTrackSearchResult } from "./useAppleMusicTrackSearch";

export const useAppleMusicPlaylistCreation = () => {
  const navigate = useNavigate();
  const { musicKitInstance, isAuthorized } = useMusicKit();
  const [selectedTracks, setSelectedTracks] = useState<
    AppleMusicTrackSearchResult[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addTrack = (track: AppleMusicTrackSearchResult) => {
    if (!selectedTracks.find((t) => t.id === track.id)) {
      setSelectedTracks((prev) => [...prev, track]);
    }
  };

  const removeTrack = (trackId: string) => {
    setSelectedTracks((prev) => prev.filter((t) => t.id !== trackId));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const createPlaylist = async () => {
    if (
      !musicKitInstance ||
      !isAuthorized ||
      !playlistName ||
      selectedTracks.length === 0
    ) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.music.apple.com/v1/me/library/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${musicKitInstance.developerToken}`,
            "Music-User-Token": musicKitInstance.musicUserToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attributes: {
              name: playlistName,
              description: playlistDescription || undefined,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create playlist: ${response.statusText}`);
      }

      const playlist = await response.json();

      // Then add tracks to the playlist
      if (playlist.data && playlist.data[0]?.id) {
        const playlistId = playlist.data[0].id;

        // Add tracks
        const tracksResponse = await fetch(
          `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${musicKitInstance.developerToken}`,
              "Music-User-Token": musicKitInstance.musicUserToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: selectedTracks.map((track) => ({
                id: track.id,
                type: "songs",
              })),
            }),
          }
        );

        if (!tracksResponse.ok) {
          throw new Error(`Failed to add tracks: ${tracksResponse.statusText}`);
        }

        // Upload artwork if provided
        if (imageFile) {
          const formData = new FormData();
          formData.append("image", imageFile);

          const artworkResponse = await fetch(
            `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/artwork`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${musicKitInstance.developerToken}`,
                "Music-User-Token": musicKitInstance.musicUserToken,
              },
              body: formData,
            }
          );

          if (!artworkResponse.ok) {
            console.warn(
              "Failed to upload artwork:",
              artworkResponse.statusText
            );
          }
        }

        navigate("/");
      }
    } catch (err) {
      console.error("Error creating playlist:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create playlist"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    selectedTracks,
    isSaving,
    playlistName,
    playlistDescription,
    imagePreview,
    error,
    setPlaylistName,
    setPlaylistDescription,
    handleImageUpload,
    addTrack,
    removeTrack,
    createPlaylist,
  };
};
