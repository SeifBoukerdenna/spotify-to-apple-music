// components/layouts/AppLayout.tsx
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MusicMode } from "../../enums/musicMode";

interface AppLayoutProps {
    children: ReactNode;
    mode: MusicMode;
}

export const AppLayout = ({ children, mode }: AppLayoutProps) => {
    const pageVariants = {
        initial: {
            opacity: 0,
            scale: 0.98,
        },
        animate: {
            opacity: 1,
            scale: 1,
        },
        exit: {
            opacity: 0,
            scale: 1.02,
        },
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={mode}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.75, ease: "circInOut" }}
                className="w-full min-h-screen"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};
