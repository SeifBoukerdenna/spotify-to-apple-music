export interface SpotifyUser {
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
  followers: { total: number };
  country: string;
  external_urls: { spotify: string };
}
