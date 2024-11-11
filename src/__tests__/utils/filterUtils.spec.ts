// filterUtils.spec.ts
import { Track } from "../../interfaces/Track.interface";
import { filterTracks } from "../../utils/filterUtils";
import { createMockTrack } from "../mocks/TrackMock";

describe("filterTracks", () => {
  const mockTracks: Track[] = [
    createMockTrack("1", "Track One"),
    createMockTrack("2", "Another Track"),
    createMockTrack("3", "Final Track"),
  ];

  it("filters tracks by track name", () => {
    const result = filterTracks(mockTracks, "Track One");
    expect(result).toEqual([mockTracks[0]]);
  });

  it("filters tracks by artist name", () => {
    const result = filterTracks(mockTracks, "Artist 1");
    expect(result).toEqual([mockTracks[0]]);
  });

  it("filters tracks by album name", () => {
    const result = filterTracks(mockTracks, "Album 2");
    expect(result).toEqual([mockTracks[1]]);
  });

  it("returns an empty array when no match is found", () => {
    const result = filterTracks(mockTracks, "Non-existent");
    expect(result).toEqual([]);
  });

  it("is case-insensitive", () => {
    const result = filterTracks(mockTracks, "track one");
    expect(result).toEqual([mockTracks[0]]);
  });
});
