// hooks/usePlaylistCreation.ts
import { useState } from "react";
import { Track } from "../interfaces/Track.interface";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const usePlaylistCreation = (token: string | null) => {
  const navigate = useNavigate();
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const addTrack = (track: Track) => {
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
    if (!token || !playlistName || selectedTracks.length === 0) return;

    setIsSaving(true);
    try {
      const userResponse = await axios.get("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = userResponse.data.id;

      const playlistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        { name: playlistName, description: playlistDescription, public: false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const playlistId = playlistResponse.data.id;

      if (imageFile) {
        const imageData = await imageFile.arrayBuffer();
        await axios.put(
          `https://api.spotify.com/v1/playlists/${playlistId}/images`,
          imageData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "image/jpeg",
            },
          }
        );
      }

      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris: selectedTracks.map((track) => track.uri) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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
