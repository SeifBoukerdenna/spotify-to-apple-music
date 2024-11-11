import { Artist } from "../../interfaces/Artist.interface";

export const createMockArtist = (id: string, name: string): Artist => ({
  id,
  name,
  external_urls: { spotify: `https://spotify.com/artist/${id}` },
});
