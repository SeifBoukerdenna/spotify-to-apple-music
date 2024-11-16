// components/appleMusic/AppleMusicHome.tsx
import { motion } from 'framer-motion';
import { useMusicKit } from '../../hooks/useMusicKit';
import { useAppleMusicUser } from '../../hooks/useAppleMusicUser';
import { AppleMusicLibrary } from './AppleMusicLibrary';
import LoadingSpinner from '../spotify/LoadingSpinner';
import { FaPlus } from 'react-icons/fa';
import { AppleMusicIcon } from '../../icons/AppleMusicIcon';
import { useNavigate } from 'react-router-dom';

const AppleMusicHome = () => {
    const navigate = useNavigate();
    const { isAuthorized, musicKitInstance, handleAuthorize, handleUnauthorize } = useMusicKit();
    const { user, isLoading: isUserLoading, error: userError } = useAppleMusicUser();

    if (!musicKitInstance) {
        return <LoadingSpinner color="#fc3c44" />;
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 to-black">
                <div className="text-center px-4">
                    <AppleMusicIcon className="w-24 h-24 mx-auto mb-6" />
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
                <LoadingSpinner color="#fc3c44" />
            ) : userError ? (
                <div className="text-red-500 text-center py-8">{userError}</div>
            ) : user ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl p-8
                   max-w-2xl mx-auto my-8 backdrop-blur-lg border border-red-500/20"
                >
                    {/* Profile Header */}
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-pink-600
                          flex items-center justify-center mb-6">
                            <AppleMusicIcon className="w-12 h-12 text-white" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">
                            Apple Music User
                        </h2>
                        <p className="text-gray-300 mb-4">
                            Region: {user.storefront.toUpperCase()}
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-6">
                            <StatsCard title="Songs" value={user.stats.songs} />
                            <StatsCard title="Playlists" value={user.stats.playlists} />
                            <StatsCard title="Albums" value={user.stats.albums} />
                        </div>

                        {/* Subscription Info */}
                        <div className="mt-6 py-3 px-6 bg-white/5 rounded-full">
                            <span className="text-red-400 font-medium">
                                {user.subscription.type} Subscription Active
                            </span>
                        </div>
                    </div>
                </motion.div>
            ) : null}

            {/* Create Playlist Button */}
            {isAuthorized && (
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
            )}

            {/* Library Section */}
            <section className="mt-12">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Library</h2>
                <AppleMusicLibrary />
            </section>
        </div>
    );
};

// Stats Card Component
const StatsCard = ({ title, value }: { title: string; value: number }) => (
    <div className="bg-white/5 rounded-xl p-4 text-center">
        <h3 className="text-red-400 font-medium text-sm">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">{value.toLocaleString()}</p>
    </div>
);

export default AppleMusicHome;