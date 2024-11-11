// sortingUtils.spec.ts
import { Track } from "../../interfaces/Track.interface";
import {
  BaseSortOptions,
  SortOptionsArtistSpecific,
} from "../../enums/sortOption";
import { sortTracks } from "../../utils/sortingUtils";
import { createMockTrack } from "../mocks/TrackMock";

describe("sortTracks", () => {
  const mockTracks: Track[] = [
    createMockTrack("1", "Track A"),
    createMockTrack("2", "Track B"),
    createMockTrack("3", "Track C"),
  ];

  it("sorts tracks by name", () => {
    const result = sortTracks(mockTracks, BaseSortOptions.Name);
    expect(result).toEqual([mockTracks[0], mockTracks[1], mockTracks[2]]);
  });

  it("sorts tracks by artist name", () => {
    // Ensure each track has distinct artist names for testing sort order
    const sortedTracks = [
      createMockTrack("3", "Track C"),
      createMockTrack("2", "Track B"),
      createMockTrack("1", "Track A"),
    ];
    sortedTracks[0].artists[0].name = "Artist A";
    sortedTracks[1].artists[0].name = "Artist B";
    sortedTracks[2].artists[0].name = "Artist C";

    const result = sortTracks(sortedTracks, SortOptionsArtistSpecific.artist);
    expect(result).toEqual([sortedTracks[0], sortedTracks[1], sortedTracks[2]]);
  });

  it("sorts tracks by album name", () => {
    // Ensure each track has distinct album names for testing sort order
    const sortedTracks = [
      createMockTrack("3", "Track C"),
      createMockTrack("1", "Track A"),
      createMockTrack("2", "Track B"),
    ];
    sortedTracks[0].album.name = "Album A";
    sortedTracks[1].album.name = "Album B";
    sortedTracks[2].album.name = "Album C";

    const result = sortTracks(sortedTracks, SortOptionsArtistSpecific.album);
    expect(result).toEqual([sortedTracks[0], sortedTracks[1], sortedTracks[2]]);
  });

  it("returns unsorted tracks when sort option is 'none'", () => {
    const result = sortTracks(mockTracks, BaseSortOptions.None);
    expect(result).toEqual(mockTracks);
  });
});
