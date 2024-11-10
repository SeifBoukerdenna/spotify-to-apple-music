// src/interfaces/Album.interface.ts

import { Artist } from "./Artist.interface";

export interface Album {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  external_urls: { spotify: string };
  artists: Artist[];
  // Include other properties as needed
}
