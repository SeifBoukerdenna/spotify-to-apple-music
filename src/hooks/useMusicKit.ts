import { useState, useEffect } from "react";
import { VITE_APPLE_DEVELOPER_TOKEN } from "../config";

declare global {
  interface Window {
    MusicKit: MusicKit.MusicKit;
  }
}

export const useMusicKit = () => {
  const [musicKitInstance, setMusicKitInstance] =
    useState<MusicKit.MusicKitInstance | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const initializeMusicKit = async () => {
      await window.MusicKit.configure({
        developerToken: VITE_APPLE_DEVELOPER_TOKEN,
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
      await musicKitInstance.unauthorize();
      setIsAuthorized(false);
    }
  };

  return {
    musicKitInstance,
    isAuthorized,
    handleAuthorize,
    handleUnauthorize,
  };
};
