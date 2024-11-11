import { useState, useEffect } from "react";
import { API_URL } from "../config";

declare global {
  interface Window {
    MusicKit: MusicKit.MusicKit;
  }
}

/**
 * Custom React hook to initialize and manage the Apple MusicKit SDK instance.
 *
 * This hook fetches a developer token, configures the MusicKit instance,
 * and provides methods to handle authorization and unauthorization actions.
 * It also checks and sets the initial authorization state.
 *
 * @returns {Object} The MusicKit instance and authorization status, with functions for authorizing and unauthorizing.
 * @property {MusicKit.MusicKitInstance | null} musicKitInstance - The configured MusicKit instance, or null if not yet initialized.
 * @property {boolean} isAuthorized - A flag indicating whether the user is authorized with Apple Music.
 * @property {function} handleAuthorize - A function to manually authorize the user with MusicKit.
 * @property {function} handleUnauthorize - A function to unauthorize the user with MusicKit.
 *
 * @example
 * const { musicKitInstance, isAuthorized, handleAuthorize, handleUnauthorize } = useMusicKit();
 * if (isAuthorized) {
 *   // Access authorized Apple Music features
 * } else {
 *   handleAuthorize(); // Prompt for authorization
 * }
 */
export const useMusicKit = () => {
  const [musicKitInstance, setMusicKitInstance] =
    useState<MusicKit.MusicKitInstance | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const initializeMusicKit = async () => {
      try {
        const response = await fetch(`${API_URL}getDeveloperToken`);
        if (!response.ok) {
          throw new Error("Failed to fetch developer token");
        }
        const data = await response.json();
        const developerToken = data.token;

        await window.MusicKit.configure({
          developerToken,
          app: {
            name: "Your App Name",
            build: "1.0.0",
          },
        });

        const music = window.MusicKit.getInstance();
        setMusicKitInstance(music);
        setIsAuthorized(music.isAuthorized);

        if (!music.isAuthorized) {
          try {
            await music.authorize();
            setIsAuthorized(true);
          } catch (error) {
            console.error("Authorization failed:", error);
          }
        }
      } catch (error) {
        console.error("Error initializing MusicKit:", error);
      }
    };

    if (window.MusicKit) {
      initializeMusicKit();
    } else {
      const script = document.createElement("script");
      script.src = "https://js-cdn.music.apple.com/musickit/v1/musickit.js";
      script.onload = initializeMusicKit;
      document.head.appendChild(script);
    }
  }, []);

  const handleAuthorize = async () => {
    if (musicKitInstance) {
      try {
        await musicKitInstance.authorize();
        setIsAuthorized(true);
      } catch (error) {
        console.error("Authorization failed:", error);
      }
    }
  };

  const handleUnauthorize = async () => {
    if (musicKitInstance) {
      try {
        await musicKitInstance.unauthorize();
        setIsAuthorized(false);
      } catch (error) {
        console.error("Unauthorization failed:", error);
      }
    }
  };

  return {
    musicKitInstance,
    isAuthorized,
    handleAuthorize,
    handleUnauthorize,
  };
};
