import { useState, useEffect } from "react";
import { MusicMode } from "../enums/musicMode";

export const useAppMode = () => {
  const [mode, setMode] = useState<MusicMode>(
    () => (localStorage.getItem("musicMode") as MusicMode) || MusicMode.Spotify
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleMode = () => {
    setIsTransitioning(true);
    const newMode =
      mode === MusicMode.Spotify ? MusicMode.AppleMusic : MusicMode.Spotify;
    setMode(newMode);
    localStorage.setItem("musicMode", newMode);
  };

  useEffect(() => {
    document.body.className =
      mode === MusicMode.Spotify
        ? "bg-gray-900 text-white transition-colors duration-700"
        : "bg-gradient-to-b from-gray-800 to-black text-white transition-colors duration-700";
  }, [mode]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 700);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return { mode, isTransitioning, toggleMode };
};
