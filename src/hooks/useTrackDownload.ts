// hooks/useTrackDownload.ts
import FileSaver from "file-saver";
import { Track } from "../interfaces/Track.interface";

export const useTrackDownload = () => {
  const handleDownload = (track: Track) => {
    const blob = new Blob([JSON.stringify(track, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    FileSaver.saveAs(blob, `${track.name}-metadata.json`);
  };

  return { handleDownload };
};
