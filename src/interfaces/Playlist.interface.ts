export interface Playlist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  tracks: { total: number };
  external_urls: { spotify: string };
}