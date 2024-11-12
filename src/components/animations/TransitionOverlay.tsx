// components/animations/TransitionOverlay.tsx
import { motion } from "framer-motion";
import { FaSpotify, FaApple } from "react-icons/fa";
import { MusicMode } from "../../enums/musicMode";

interface TransitionOverlayProps {
    isTransitioning: boolean;
    mode: MusicMode;
}

export const TransitionOverlay = ({ isTransitioning, mode }: TransitionOverlayProps) => {
    if (!isTransitioning) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md"
        >
            <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="text-6xl"
            >
                {mode === MusicMode.Spotify ? (
                    <FaSpotify className="text-[#1DB954]" />
                ) : (
                    <FaApple className="text-[#fff]" />
                )}
            </motion.div>
        </motion.div>
    );
};