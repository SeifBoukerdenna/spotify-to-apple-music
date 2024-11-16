// App.tsx
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAppMode } from "./hooks/useAppMode";
import { TransitionOverlay } from "./components/animations/TransitionOverlay";
import { ModeToggle } from "./components/navigation/ModeToggle";
import Home from "./components/spotify/Home";
import LikedSongsDetail from "./components/spotify/LikedSongsDetails";
import AppleMusicHome from "./components/appleMusic/AppleMusicHome";
import CreatePlaylist from "./components/spotify/CreatePlaylist";
import PlaylistDetail from "./components/spotify/PlaylistDetail";
import { MusicMode } from "./enums/musicMode";
import { AppLayout } from "./components/layout/AppLayout";
import AppleMusicCreatePlaylist from "./components/appleMusic/AppleMusicCreatePlaylist";
import AppleMusicPlaylistDetail from "./components/appleMusic/AppleMusicPlaylistDetail";

const AppContent = () => {
  const navigate = useNavigate();
  const { mode, isTransitioning, toggleMode } = useAppMode();

  const handleModeToggle = () => {
    toggleMode();
    navigate(mode === MusicMode.Spotify ? "/apple-music" : "/spotify");
  };

  return (
    <div className="app-container min-h-screen font-sans relative overflow-hidden">
      <AnimatePresence>
        <TransitionOverlay isTransitioning={isTransitioning} mode={mode} />
      </AnimatePresence>

      <ModeToggle mode={mode} onToggle={handleModeToggle} />

      <AppLayout mode={mode}>
        <Routes>
          {/* Root redirect */}
          <Route
            path="/"
            element={
              <Navigate
                to={mode === MusicMode.Spotify ? "/spotify" : "/apple-music"}
                replace
              />
            }
          />

          {/* Spotify Routes */}
          <Route path="/spotify" element={<Home />} />
          <Route path="/spotify/liked-songs" element={<LikedSongsDetail />} />
          <Route path="/spotify/create-playlist" element={<CreatePlaylist />} />
          <Route path="/spotify/playlist/:id" element={<PlaylistDetail />} />

          {/* Apple Music Routes */}
          <Route path="/apple-music" element={<AppleMusicHome />} />
          <Route path="/apple-music/create-playlist" element={<AppleMusicCreatePlaylist />} />
          <Route path="/apple-music/playlist/:id" element={<AppleMusicPlaylistDetail />} />

          {/* Fallback routes */}
          <Route
            path="*"
            element={
              <Navigate
                to={mode === MusicMode.Spotify ? "/spotify" : "/apple-music"}
                replace
              />
            }
          />
        </Routes>
      </AppLayout>
    </div>
  );
};

const App = () => {
  return (
    <Router future={{ v7_startTransition: true }}>
      <AppContent />
    </Router>
  );
};

export default App;