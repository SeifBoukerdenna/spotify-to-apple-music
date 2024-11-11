import { PlaylistTrack } from "../../interfaces/PlaylistTrack.interface";
import { createMockTrack } from "./TrackMock";
import { createMockUser } from "./userMock";

// Factory function to create a mock PlaylistTrack
export const createMockPlaylistTrack = (
  id: string,
  name: string,
  userId: string,
  userName: string
): PlaylistTrack => ({
  added_at: new Date().toISOString(),
  added_by: createMockUser(userId, userName),
  is_local: false,
  track: createMockTrack(id, name),
});
