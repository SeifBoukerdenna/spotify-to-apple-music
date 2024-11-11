import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import LikedSongsDetail from "./components/LikedSongs";
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
        {/* Toggle Button */}
        <div className="mode-toggle">
          <button onClick={toggleMode}>
            Switch to {mode === MusicMode.Spotify ? "Apple Music" : "Spotify"}{" "}
            Mode
          </button>
        </div>
        {/* Routes */}
        <Routes>
          {mode === MusicMode.Spotify ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/liked-songs" element={<LikedSongsDetail />} />
            </>
          ) : (
            <>
              <Route path="/" element={<AppleMusicHome />} />
              {/* Add more Apple Music routes here if needed */}
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
