// src/interfaces/Track.interface.ts

import { Album } from "./Album.interface";
import { Artist } from "./Artist.interface";

export interface Track {
  id: string;
  name: string;
  album: Album;
  artists: Artist[];
  external_urls: { spotify: string };
  // Include other properties as needed
}
