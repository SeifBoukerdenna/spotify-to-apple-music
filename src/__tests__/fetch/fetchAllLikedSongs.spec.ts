import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { fetchAllLikedSongs } from "../../fetch/fetchAllLikedSongs";
import { SavedTrackItem } from "../../interfaces/SavedTrack.interface";

describe("fetchAllLikedSongs", () => {
  const mock = new MockAdapter(axios);
  const token = "test-token";

  afterEach(() => {
    mock.reset();
  });

  it("should fetch all liked songs successfully", async () => {
    const mockTracksPage1: {
      items: SavedTrackItem[];
      next: string | null;
      total: number;
    } = {
      items: [
        {
          track: {
            id: "1",
            name: "Song 1",
            album: {
              id: "album1",
              name: "Album 1",
              images: [{ url: "http://example.com/image1.jpg" }],
              release_date: "2020-01-01",
              release_date_precision: "day",
              total_tracks: 10,
              type: "album",
              external_urls: { spotify: "http://spotify.com/album1" },
              artists: [
                {
                  id: "artist1",
                  name: "Artist 1",
                  external_urls: { spotify: "http://spotify.com/artist1" },
                },
              ],
            },
            artists: [
              {
                id: "artist1",
                name: "Artist 1",
                external_urls: { spotify: "http://spotify.com/artist1" },
              },
            ],
            external_urls: { spotify: "http://spotify.com/track1" },
          },
        },
        {
          track: {
            id: "2",
            name: "Song 2",
            album: {
              id: "album2",
              name: "Album 2",
              images: [{ url: "http://example.com/image2.jpg" }],
              release_date: "2021-02-02",
              release_date_precision: "day",
              total_tracks: 12,
              type: "album",
              external_urls: { spotify: "http://spotify.com/album2" },
              artists: [
                {
                  id: "artist2",
                  name: "Artist 2",
                  external_urls: { spotify: "http://spotify.com/artist2" },
                },
              ],
            },
            artists: [
              {
                id: "artist2",
                name: "Artist 2",
                external_urls: { spotify: "http://spotify.com/artist2" },
              },
            ],
            external_urls: { spotify: "http://spotify.com/track2" },
          },
        },
      ],
      next: "https://api.spotify.com/v1/me/tracks?limit=50&offset=50",
      total: 2,
    };

    const mockTracksPage2: {
      items: SavedTrackItem[];
      next: string | null;
      total: number;
    } = {
      items: [],
      next: null,
      total: 2,
    };

    // Mock the first API call
    mock
      .onGet(`https://api.spotify.com/v1/me/tracks?limit=50&offset=0`)
      .reply(200, mockTracksPage1);

    // Mock the second API call
    mock
      .onGet(`https://api.spotify.com/v1/me/tracks?limit=50&offset=50`)
      .reply(200, mockTracksPage2);

    const result = await fetchAllLikedSongs(token);

    expect(result).toEqual([
      {
        id: "1",
        name: "Song 1",
        album: {
          id: "album1",
          name: "Album 1",
          images: [{ url: "http://example.com/image1.jpg" }],
          release_date: "2020-01-01",
          release_date_precision: "day",
          total_tracks: 10,
          type: "album",
          external_urls: { spotify: "http://spotify.com/album1" },
          artists: [
            {
              id: "artist1",
              name: "Artist 1",
              external_urls: { spotify: "http://spotify.com/artist1" },
            },
          ],
        },
        artists: [
          {
            id: "artist1",
            name: "Artist 1",
            external_urls: { spotify: "http://spotify.com/artist1" },
          },
        ],
        external_urls: { spotify: "http://spotify.com/track1" },
      },
      {
        id: "2",
        name: "Song 2",
        album: {
          id: "album2",
          name: "Album 2",
          images: [{ url: "http://example.com/image2.jpg" }],
          release_date: "2021-02-02",
          release_date_precision: "day",
          total_tracks: 12,
          type: "album",
          external_urls: { spotify: "http://spotify.com/album2" },
          artists: [
            {
              id: "artist2",
              name: "Artist 2",
              external_urls: { spotify: "http://spotify.com/artist2" },
            },
          ],
        },
        artists: [
          {
            id: "artist2",
            name: "Artist 2",
            external_urls: { spotify: "http://spotify.com/artist2" },
          },
        ],
        external_urls: { spotify: "http://spotify.com/track2" },
      },
    ]);

    // Ensure both API calls were made
    expect(mock.history.get.length).toBe(2);
  });

  it("should throw an error if token is not provided", async () => {
    await expect(fetchAllLikedSongs(null)).rejects.toThrow(
      "No token available"
    );
  });

  it("should handle API errors gracefully", async () => {
    mock
      .onGet(`https://api.spotify.com/v1/me/tracks?limit=50&offset=0`)
      .reply(500);

    await expect(fetchAllLikedSongs(token)).rejects.toThrow();
  });
});
