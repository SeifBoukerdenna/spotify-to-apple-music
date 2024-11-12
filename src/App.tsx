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
  const [mode, setMode] = useState<MusicMode>(MusicMode.Spotify);

  const toggleMode = () => {
    setMode((prevMode) =>
      prevMode === MusicMode.Spotify ? MusicMode.AppleMusic : MusicMode.Spotify
    );
  };

  useEffect(() => {
    document.body.className = mode === MusicMode.Spotify ? 'bg-gray-900 text-white' : 'bg-white text-black';
  }, [mode]);

  return (
    <Router>
      <div className="app-container min-h-screen flex flex-col items-center justify-center p-4 font-sans relative">
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={toggleMode}
            className={`flex items-center gap-2 px-5 py-2 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105
              ${mode === MusicMode.Spotify
                ? "bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-400 hover:to-red-400"
                : "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-400 hover:to-teal-400"
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
              <Route path="/playlist/:id" element={<PlaylistDetail />} /> {/* Dynamic Route */}
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
