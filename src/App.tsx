// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import LikedSongsDetail from './components/LikedSongs';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/liked-songs" element={<LikedSongsDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
