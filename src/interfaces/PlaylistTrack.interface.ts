// Import the Track interface
import { Track } from "./Track.interface";

export interface PlaylistTrack {
  added_at: string;
  added_by: {
    external_urls: { spotify: string };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  track: Track;
}
