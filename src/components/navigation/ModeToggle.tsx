// components/navigation/ModeToggle.tsx
import { motion } from "framer-motion";
import { FaSpotify, FaApple } from "react-icons/fa";
import { MusicMode } from "../../enums/musicMode";

interface ModeToggleProps {
    mode: MusicMode;
    onToggle: () => void;
}

export const ModeToggle = ({ mode, onToggle }: ModeToggleProps) => {
    return (
        <div className="fixed top-4 right-4 z-40">
            <motion.button
                onClick={onToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full shadow-lg ${mode === MusicMode.Spotify
                    ? "bg-gradient-to-r from-[#fc3c44] to-[#ff2d55] text-white"
                    : "bg-gradient-to-r from-[#1DB954] to-[#1ed760] text-white"
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
            </motion.button>
        </div>
    );
};
