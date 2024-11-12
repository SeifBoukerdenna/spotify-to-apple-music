import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/spotify/Home";
import LikedSongsDetail from "./components/spotify/LikedSongs";
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
            className={`px-4 py-2 rounded-full transition-colors duration-300 ${mode === MusicMode.AppleMusic
              ? "bg-green-500 text-white hover:bg-green-400"
              : "bg-red-500 text-white hover:bg-red-400"
              }`}
          >
            Switch to {mode === MusicMode.Spotify ? "Apple Music" : "Spotify"}
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
