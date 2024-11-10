declare namespace MusicKit {
  interface MusicKitInstance {
    isAuthorized: boolean;
    musicUserToken: string;
    authorize(): Promise<string>;
    unauthorize(): Promise<void>;
    api: Api;
  }

  interface MusicKit {
    configure(config: MusicKitConfig): Promise<void>;
    getInstance(): MusicKitInstance;
  }

  interface MusicKitConfig {
    developerToken: string;
    app: {
      name: string;
      build: string;
    };
  }

  interface Api {
    library: {
      playlists(): Promise<Resource<Playlist>[]>;
    };
  }

  interface Resource<T> {
    id: string;
    type: string;
    href: string;
    attributes: T;
  }

  interface PlaylistAttributes {
    name: string;
    description?: DescriptionAttribute;
    artwork?: Artwork;
  }

  interface DescriptionAttribute {
    standard: string;
    short?: string;
  }

  interface Artwork {
    width: number;
    height: number;
    url: string;
    bgColor?: string;
    textColor1?: string;
    textColor2?: string;
    textColor3?: string;
    textColor4?: string;
  }

  type Playlist = PlaylistAttributes;
}
