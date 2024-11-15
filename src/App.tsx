// App.tsx
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
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

// Create a wrapper component that will have access to navigation
const AppContent = () => {
  const navigate = useNavigate();
  const { mode, isTransitioning, toggleMode } = useAppMode();

  const handleModeToggle = () => {
    toggleMode();
    navigate("/");
  };

  return (
    <div className="app-container min-h-screen font-sans relative overflow-hidden">
      <AnimatePresence>
        <TransitionOverlay isTransitioning={isTransitioning} mode={mode} />
      </AnimatePresence>

      <ModeToggle mode={mode} onToggle={handleModeToggle} />

      <AppLayout mode={mode}>
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
              <Route path="*" element={<AppleMusicHome />} />
            </>
          )}
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