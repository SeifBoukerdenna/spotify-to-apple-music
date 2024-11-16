// hooks/useAppleMusicDownload.ts
import FileSaver from "file-saver";
import { AppleMusicTrack } from "./useAppleMusicLibrary";
import { Parser } from "@json2csv/plainjs";

export const useAppleMusicDownload = () => {
  const handleTrackDownload = (track: AppleMusicTrack) => {
    const trackData = {
      id: track.id,
      name: track.attributes.name,
      artist: track.attributes.artistName,
      album: track.attributes.albumName,
      releaseDate: track.attributes.releaseDate,
      artwork: track.attributes.artwork.url
        .replace("{w}", "1200")
        .replace("{h}", "1200"),
      trackNumber: track.attributes.trackNumber,
    };

    const blob = new Blob([JSON.stringify(trackData, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    FileSaver.saveAs(blob, `${track.attributes.name}-metadata.json`);
  };

  const handlePlaylistDownload = async (
    playlist: MusicKit.Resource<MusicKit.PlaylistAttributes>,
    musicKitInstance: MusicKit.MusicKitInstance
  ) => {
    try {
      let tracks: AppleMusicTrack[] = [];

      // First try to get the detailed playlist data including tracks
      const playlistResponse = await fetch(
        `https://api.music.apple.com/v1/me/library/playlists/${playlist.id}`,
        {
          headers: {
            Authorization: `Bearer ${musicKitInstance.developerToken}`,
            "Music-User-Token": musicKitInstance.musicUserToken,
          },
        }
      );

      if (!playlistResponse.ok) {
        throw new Error("Failed to fetch playlist details");
      }

      const playlistData = await playlistResponse.json();

      // If the playlist has tracks in the relationships, use those
      if (playlistData.data[0]?.relationships?.tracks?.data) {
        tracks = playlistData.data[0].relationships.tracks.data;
      } else {
        // Otherwise, fetch tracks separately
        const tracksResponse = await fetch(
          `https://api.music.apple.com/v1/me/library/playlists/${playlist.id}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${musicKitInstance.developerToken}`,
              "Music-User-Token": musicKitInstance.musicUserToken,
            },
          }
        );

        if (!tracksResponse.ok) {
          throw new Error("Failed to fetch playlist tracks");
        }

        const tracksData = await tracksResponse.json();
        tracks = tracksData.data;
      }

      const tracksData = tracks.map((track) => ({
        song: track.attributes.name,
        artist: track.attributes.artistName,
        album: track.attributes.albumName,
        releaseDate: track.attributes.releaseDate || "N/A",
      }));

      const json2csvParser = new Parser();
      const csvData = json2csvParser.parse(tracksData);
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
      FileSaver.saveAs(blob, `${playlist.attributes.name}-metadata.csv`);
    } catch (error) {
      console.error("Error downloading playlist:", error);
      throw error; // Re-throw to handle in the component
    }
  };

  return {
    handleTrackDownload,
    handlePlaylistDownload,
  };
};
