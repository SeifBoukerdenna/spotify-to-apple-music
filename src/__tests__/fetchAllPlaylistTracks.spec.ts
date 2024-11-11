import axios from "axios";
import { PlaylistTrack } from "../interfaces/PlaylistTrack.interface";
import { fetchAllPlaylistTracks } from "../fetch/fetchAllPlaylistTracks";
import MockAdapter from "axios-mock-adapter";
import { createMockPlaylistTrack } from "./mocks/playlistMock";

describe("fetchAllPlaylistTracks", () => {
  const mock = new MockAdapter(axios);
  const token = "test-token";
  const playlistId = "test-playlist-id";

  afterEach(() => {
    mock.reset();
  });

  it("should fetch all playlist tracks successfully with multiple pages", async () => {
    // Define mock data for the first page
    const mockTracksPage1: {
      items: PlaylistTrack[];
      next: string | null;
      total: number;
    } = {
      items: [
        createMockPlaylistTrack("1", "Track 1", "user1", "User One"),
        createMockPlaylistTrack("2", "Track 2", "user1", "User One"),
      ],
      next: `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&offset=100`,
      total: 2,
    };

    // Define mock data for the second page (no more tracks)
    const mockTracksPage2: {
      items: PlaylistTrack[];
      next: string | null;
      total: number;
    } = {
      items: [],
      next: null,
      total: 2,
    };

    // Mock the first API call
    mock
      .onGet(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&offset=0`
      )
      .reply(200, mockTracksPage1);

    // Mock the second API call
    mock
      .onGet(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&offset=100`
      )
      .reply(200, mockTracksPage2);

    const result = await fetchAllPlaylistTracks(playlistId, token);

    // Assert the result matches the expected data
    expect(result).toEqual(mockTracksPage1.items);

    // Ensure both API calls were made
    expect(mock.history.get.length).toBe(2);
  });

  it("should fetch all playlist tracks successfully in a single page", async () => {
    // Define mock data for a single page
    const mockTracksPage1: {
      items: PlaylistTrack[];
      next: string | null;
      total: number;
    } = {
      items: [
        createMockPlaylistTrack("1", "Track 1", "user1", "User One"),
        createMockPlaylistTrack("2", "Track 2", "user1", "User One"),
      ],
      next: null,
      total: 2,
    };

    // Mock the API call
    mock
      .onGet(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&offset=0`
      )
      .reply(200, mockTracksPage1);

    const result = await fetchAllPlaylistTracks(playlistId, token);

    // Assert the result matches the expected data
    expect(result).toEqual(mockTracksPage1.items);

    // Ensure only one API call was made
    expect(mock.history.get.length).toBe(1);
  });

  it("should throw an error if token is not provided", async () => {
    await expect(fetchAllPlaylistTracks(playlistId, null)).rejects.toThrow(
      "No token available"
    );
  });

  it("should handle API errors gracefully", async () => {
    // Mock the API call to return a 500 error
    mock
      .onGet(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&offset=0`
      )
      .reply(500);

    await expect(fetchAllPlaylistTracks(playlistId, token)).rejects.toThrow();
  });
});
