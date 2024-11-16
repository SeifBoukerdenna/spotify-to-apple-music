// hooks/useMusicKit.ts
import { useState, useEffect } from "react";
import { API_URL } from "../config";

declare global {
  interface Window {
    MusicKit: MusicKit.MusicKit;
  }
}

export const useMusicKit = () => {
  const [musicKitInstance, setMusicKitInstance] =
    useState<MusicKit.MusicKitInstance | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

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

        const instance = window.MusicKit.getInstance();

        // Set the storefront (required for search)
        if (!instance.api.storefronts.currentStorefront) {
          instance.api.storefronts.currentStorefront = "us"; // Default to US storefront
        }

        setMusicKitInstance(instance);
        setIsAuthorized(instance.isAuthorized);
        setIsInitialized(true);

        if (!instance.isAuthorized) {
          try {
            await instance.authorize();
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
      script.async = true;
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
    isInitialized,
    handleAuthorize,
    handleUnauthorize,
  };
};
