import { Album } from "../../interfaces/Album.interface";
import { createMockArtist } from "./artistMock";

// Factory function to create a mock Album
export const createMockAlbum = (id: string, name: string): Album => ({
  id,
  name,
  images: [{ url: `https://example.com/image/${id}.jpg` }],
  release_date: "2020-01-01",
  release_date_precision: "day",
  total_tracks: 10,
  type: "album",
  external_urls: { spotify: `https://spotify.com/album/${id}` },
  artists: [createMockArtist(`artist-${id}`, `Artist ${id}`)],
});
