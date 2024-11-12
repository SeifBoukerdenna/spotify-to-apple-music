import { Track } from "../../interfaces/Track.interface";
import { createMockAlbum } from "./albumMock";
import { createMockArtist } from "./artistMock";

// Factory function to create a mock Track
export const createMockTrack = (id: string, name: string): Track => ({
  id,
  name,
  album: createMockAlbum(`album-${id}`, `Album ${id}`),
  artists: [createMockArtist(`artist-${id}`, `Artist ${id}`)],
  external_urls: { spotify: `https://spotify.com/track/${id}` },
  uri: "",
});
