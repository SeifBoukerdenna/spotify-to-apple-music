// hooks/useMetadataDownload.ts
import { Parser } from "@json2csv/plainjs";
import FileSaver from "file-saver";
import { Playlist } from "../interfaces/Playlist.interface";
import { fetchAllPlaylistTracks } from "../fetch/fetchAllPlaylistTracks";
import { fetchAllLikedSongs } from "../fetch/fetchAllLikedSongs";

export const useMetadataDownload = (token: string | null) => {
  const handlePlaylistDownload = async (playlist: Playlist) => {
    try {
      const allTracks = await fetchAllPlaylistTracks(playlist.id, token);
      const tracksData = allTracks.map((item) => ({
        song: item.track.name,
        artist: item.track.artists.map((a) => a.name).join(", "),
        album: item.track.album.name,
        year: item.track.album.release_date?.slice(0, 4) || "",
      }));

      const json2csvParser = new Parser();
      const csvData = json2csvParser.parse(tracksData);
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
      FileSaver.saveAs(blob, `${playlist.name}-metadata.csv`);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
      alert("Failed to download playlist metadata.");
    }
  };

  const handleLikedSongsDownload = async () => {
    try {
      const allLikedSongs = await fetchAllLikedSongs(token);
      const tracksData = allLikedSongs.map((track) => ({
        song: track.name,
        artist: track.artists.map((a) => a.name).join(", "),
        album: track.album.name,
        year: track.album.release_date?.slice(0, 4) || "",
      }));

      const json2csvParser = new Parser();
      const csvData = json2csvParser.parse(tracksData);
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
      FileSaver.saveAs(blob, `Liked-Songs-metadata.csv`);
    } catch (error) {
      console.error("Error fetching liked songs:", error);
      alert("Failed to download liked songs metadata.");
    }
  };

  return {
    handlePlaylistDownload,
    handleLikedSongsDownload,
  };
};
