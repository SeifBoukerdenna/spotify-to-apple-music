// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import LikedSongsDetail from './components/LikedSongs';
import './index.css';
import AppleMusicHome from './components/appleMusic/AppleMusicHome';

const App = () => {
  const [mode, setMode] = useState<'spotify' | 'appleMusic'>('spotify');

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'spotify' ? 'appleMusic' : 'spotify'));
  };

  useEffect(() => {
    // Update the body class based on the mode
    document.body.className = mode;
  }, [mode]);

  return (
    <Router>
      <div className="app-container">
        {/* Toggle Button */}
        <div className="mode-toggle">
          <button onClick={toggleMode}>
            Switch to {mode === 'spotify' ? 'Apple Music' : 'Spotify'} Mode
          </button>
        </div>
        {/* Routes */}
        <Routes>
          {mode === 'spotify' ? (
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
