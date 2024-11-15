declare namespace MusicKit {
  /**
   * Represents an instance of MusicKit, providing access to authorization status,
   * user token, and the MusicKit API.
   */
  interface MusicKitInstance {
    /** Indicates if the user is authorized with Apple Music. */
    isAuthorized: boolean;

    /** The music user token obtained after authorization. */
    musicUserToken: string;

    /**
     * Authorizes the user with Apple Music, returning a music user token.
     * @returns {Promise<string>} A promise that resolves to the music user token.
     */
    authorize(): Promise<string>;

    /**
     * Revokes authorization from the user.
     * @returns {Promise<void>} A promise that resolves when unauthorization is complete.
     */
    unauthorize(): Promise<void>;

    /** Provides access to MusicKit's API. */
    api: Api;
  }

  /**
   * Main MusicKit interface for configuring and obtaining the MusicKit instance.
   */
  interface MusicKit {
    /**
     * Configures the MusicKit SDK with the necessary settings.
     * @param {MusicKitConfig} config - The configuration object containing developer token and app details.
     * @returns {Promise<void>} A promise that resolves when the configuration is complete.
     */
    configure(config: MusicKitConfig): Promise<void>;

    /**
     * Gets the current MusicKit instance.
     * @returns {MusicKitInstance} The singleton instance of MusicKit.
     */
    getInstance(): MusicKitInstance;
  }

  /**
   * Configuration for the MusicKit SDK.
   */
  interface MusicKitConfig {
    /** Developer token used for authorization with the Apple Music API. */
    developerToken: string;

    /** Information about the app using the MusicKit SDK. */
    app: {
      /** The name of the app. */
      name: string;

      /** The build version of the app. */
      build: string;
    };
  }

  /**
   * The API interface for accessing Apple Music library resources.
   */
  interface Api {
    library: {
      /**
       * Retrieves the playlists in the user's Apple Music library.
       * @returns {Promise<Resource<Playlist>[]>} A promise that resolves to an array of Playlist resources.
       */
      playlists(): Promise<Resource<PlaylistAttributes>[]>;
    };
  }

  interface TrackAttributes {
    name: string;
    artistName: string;
    albumName: string;
    artwork: Artwork;
    playParams: {
      id: string;
      kind: string;
    };
  }

  /**
   * Represents a generic resource from the Apple Music API.
   * @template T - The type of the resource's attributes.
   */
  interface Resource<T> {
    id: string;
    type: string;
    href: string;
    attributes: T;
    relationships?: {
      tracks?: {
        data: Resource<TrackAttributes>[];
        meta: {
          total: number;
        };
      };
    };
  }

  /**
   * Attributes for an Apple Music playlist resource.
   */
  interface PlaylistAttributes {
    /** The name of the playlist. */
    name: string;

    /** The description of the playlist, if available. */
    description?: DescriptionAttribute;

    /** The artwork for the playlist, if available. */
    artwork?: Artwork;

    /** Whether the playlist has a catalog version. */
    hasCatalog: boolean;

    /** Whether the playlist is in the user's library. */
    hasLibrary: boolean;

    /** Whether the playlist is public. */
    isPublic: boolean;

    /** Whether the user can edit the playlist. */
    canEdit: boolean;

    /** The number of tracks in the playlist. */
    trackCount: number;
  }

  /**
   * Represents description attributes for a resource, with standard and optional short descriptions.
   */
  interface DescriptionAttribute {
    /** The full description. */
    standard: string;

    /** A shortened version of the description, if available. */
    short?: string;
  }

  /**
   * Artwork information for a resource, including dimensions and colors.
   */
  interface Artwork {
    /** Width of the artwork in pixels. */
    width: number;

    /** Height of the artwork in pixels. */
    height: number;

    /** URL template for the artwork image. */
    url: string;

    /** Optional background color for the artwork. */
    bgColor?: string;

    /** Optional primary text color. */
    textColor1?: string;

    /** Optional secondary text color. */
    textColor2?: string;

    /** Optional tertiary text color. */
    textColor3?: string;

    /** Optional quaternary text color. */
    textColor4?: string;
  }
}
