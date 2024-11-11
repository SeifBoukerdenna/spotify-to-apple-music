import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/spotify/Home";
import LikedSongsDetail from "./components/spotify/LikedSongs";
import "./index.css";
import AppleMusicHome from "./components/appleMusic/AppleMusicHome";
import { MusicMode } from "./enums/musicMode";

const App = () => {
  const [mode, setMode] = useState<MusicMode>(MusicMode.Spotify);

  const toggleMode = () => {
    setMode((prevMode) =>
      prevMode === MusicMode.Spotify ? MusicMode.AppleMusic : MusicMode.Spotify,
    );
  };

  useEffect(() => {
    document.body.className = mode;
  }, [mode]);

  return (
    <Router>
      <div className="app-container">
        <div className="mode-toggle">
          <button onClick={toggleMode}>
            Switch to {mode === MusicMode.Spotify ? "Apple Music" : "Spotify"}{" "}
            Mode
          </button>
        </div>
        <Routes>
          {mode === MusicMode.Spotify ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/liked-songs" element={<LikedSongsDetail />} />
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
