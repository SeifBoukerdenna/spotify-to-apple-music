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
    try {
      // Create playlist with tracks
      const tracks = selectedTracks.map((track) => ({
        id: track.id,
        type: "songs" as const,
      }));

      const playlist = await musicKitInstance.api.playlists.create({
        name: playlistName,
        description: playlistDescription,
        tracks,
      });

      // Upload artwork if provided
      if (imageFile && playlist.id) {
        const formData = new FormData();
        formData.append("image", imageFile);

        // Add artwork through your backend proxy
        await fetch(`/api/apple-music/playlists/${playlist.id}/artwork`, {
          method: "POST",
          headers: {
            "Music-User-Token": musicKitInstance.musicUserToken,
          },
          body: formData,
        });
      }

      navigate("/");
    } catch (error) {
      console.error("Error creating playlist:", error);
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
    setPlaylistName,
    setPlaylistDescription,
    handleImageUpload,
    addTrack,
    removeTrack,
    createPlaylist,
  };
};
