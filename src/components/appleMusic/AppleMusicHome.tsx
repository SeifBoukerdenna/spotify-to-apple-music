// components/appleMusic/AppleMusicHome.tsx
import { motion } from 'framer-motion';
import { useMusicKit } from '../../hooks/useMusicKit';
import { useAppleMusicUser } from '../../hooks/useAppleMusicUser';
import { AppleMusicLibrary } from './AppleMusicLibrary';
import LoadingSpinner from '../spotify/LoadingSpinner';
import { FaPlus } from 'react-icons/fa';
import { AppleMusicIcon } from '../../icons/AppleMusicIcon';
import { useNavigate } from 'react-router-dom';
import { AppleMusicUserInfo } from './AppleMusicUserInfo';
import { useEffect } from 'react';

const AppleMusicHome = () => {
    const navigate = useNavigate();
    const { isAuthorized, handleAuthorize, handleUnauthorize, isInitialized } = useMusicKit();
    const { user, isLoading: isUserLoading, error: userError, refetch } = useAppleMusicUser();

    // Effect to refetch user data when authorization status changes
    useEffect(() => {
        if (isAuthorized && isInitialized) {
            refetch();
        }
    }, [isAuthorized, isInitialized, refetch]);

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner color="#fc3c44" size={50} />
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 to-black">
                <div className="text-center px-4">
                    <AppleMusicIcon size={55} withBackground className="w-24 h-24 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-6">Connect to Apple Music</h2>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto">
                        Sign in to access your library and playlists
                    </p>
                    <button
                        onClick={handleAuthorize}
                        className="px-8 py-3 bg-gradient-to-r from-[#fc3c44] to-[#ff2d55] text-white rounded-full
                            font-semibold hover:from-[#ff2d55] hover:to-[#fc3c44] transform transition-all
                            duration-300 hover:scale-105"
                    >
                        Connect to Apple Music
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black p-12 font-sans">
            {/* Header Section */}
            <header className="text-center pb-5 border-b border-gray-700">
                <h1 className="text-2xl font-bold text-white">Apple Music Home</h1>
                <button
                    onClick={handleUnauthorize}
                    className="mt-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full
                        px-6 py-2 font-medium hover:from-red-600 hover:to-pink-700 transition-colors"
                >
                    Disconnect
                </button>
            </header>

            {/* User Profile Section */}
            {isUserLoading ? (
                <div className="flex justify-center items-center py-12">
                    <LoadingSpinner color="#fc3c44" size={40} />
                </div>
            ) : userError ? (
                <div className="text-red-500 text-center py-8">
                    <button
                        onClick={() => refetch()}
                        className="mt-4 px-4 py-2 bg-red-500/20 rounded-full text-sm
                            hover:bg-red-500/30 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            ) : user ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl p-8
                        max-w-2xl mx-auto my-8 backdrop-blur-lg border border-red-500/20"
                >
                    <AppleMusicUserInfo user={user} />
                </motion.div>
            ) : null}

            {/* Create Playlist Button */}
            <div className="text-center mt-8">
                <button
                    onClick={() => navigate("/create-playlist")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500
                        to-pink-600 text-white rounded-full font-medium hover:from-red-600
                        hover:to-pink-700 transition-colors"
                >
                    <FaPlus className="w-4 h-4" />
                    Create New Playlist
                </button>
            </div>

            {/* Library Section */}
            <section className="mt-12">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Library</h2>
                <AppleMusicLibrary />
            </section>
        </div>
    );
};

export default AppleMusicHome;