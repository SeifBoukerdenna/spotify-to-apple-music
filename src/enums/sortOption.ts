export enum BaseSortOptions {
  None = "none",
  Name = "name",
}

export enum SortOptionsPlaylistSpecific {
  Tracks = "tracks",
}

export enum SortOptionsArtistSpecific {
  artist = "artist",
  album = "album",
}

export type SortOptionsPlaylist = BaseSortOptions | SortOptionsPlaylistSpecific;
export type SortOptionsArtist = BaseSortOptions | SortOptionsArtistSpecific;
