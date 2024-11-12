import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/spotify/Home";
import LikedSongsDetail from "./components/spotify/LikedSongs";
import { FaSpotify, FaApple } from "react-icons/fa";
import "./index.css";
import AppleMusicHome from "./components/appleMusic/AppleMusicHome";
import { MusicMode } from "./enums/musicMode";
import CreatePlaylist from "./components/spotify/CreatePlaylist";
import PlaylistDetail from "./components/spotify/PlaylistDetail";

const App = () => {
  const [mode, setMode] = useState<MusicMode>(
    () => (localStorage.getItem("musicMode") as MusicMode) || MusicMode.Spotify
  );

  const toggleMode = () => {
    const newMode = mode === MusicMode.Spotify ? MusicMode.AppleMusic : MusicMode.Spotify;
    setMode(newMode);
    localStorage.setItem("musicMode", newMode);
  };

  useEffect(() => {
    document.body.className = mode === MusicMode.Spotify
      ? 'bg-gray-900 text-white'
      : 'bg-gradient-to-b from-gray-800 to-black text-white';
  }, [mode]);

  return (
    <Router>
      <div className="app-container min-h-screen flex flex-col items-center justify-center p-4 font-sans relative">
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={toggleMode}
            className={`flex items-center gap-2 px-5 py-2 rounded-full shadow-lg transition-transform transform hover:scale-105 ${mode === MusicMode.AppleMusic
              ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
              : "bg-gradient-to-r from-pink-500 to-red-500 text-white"
              }`}
          >
            {mode === MusicMode.Spotify ? (
              <FaApple className="text-xl" />
            ) : (
              <FaSpotify className="text-xl" />
            )}
            <span className="font-semibold">
              Switch to {mode === MusicMode.Spotify ? "Apple Music" : "Spotify"}
            </span>
          </button>
        </div>
        <Routes>
          {mode === MusicMode.Spotify ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/liked-songs" element={<LikedSongsDetail />} />
              <Route path="/create-playlist" element={<CreatePlaylist />} />
              <Route path="/playlist/:id" element={<PlaylistDetail />} />
            </>
          ) : (
            <>
              <Route path="/" element={<AppleMusicHome />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
