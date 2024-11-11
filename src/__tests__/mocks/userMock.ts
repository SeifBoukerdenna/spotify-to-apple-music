export const createMockUser = (id: string, displayName: string) => ({
  id,
  display_name: displayName,
  external_urls: { spotify: `https://spotify.com/user/${id}` },
  href: `https://api.spotify.com/v1/users/${id}`,
  type: "user",
  uri: `spotify:user:${id}`,
});
