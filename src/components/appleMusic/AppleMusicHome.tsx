// components/appleMusic/AppleMusicHome.tsx
import { useMusicKit } from '../../hooks/useMusicKit';
import { AppleMusicLibrary } from './AppleMusicLibrary';
import LoadingSpinner from '../spotify/LoadingSpinner';

const AppleMusicHome = () => {
    const { isAuthorized, musicKitInstance, handleAuthorize, handleUnauthorize } = useMusicKit();

    if (!musicKitInstance) {
        return <LoadingSpinner color="#fc3c44" />;
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 to-black">
                <div className="text-center px-4">
                    <h2 className="text-3xl font-bold text-white mb-6">Connect to Apple Music</h2>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto">
                        Sign in to access your library and playlists
                    </p>
                    <button
                        onClick={handleAuthorize}
                        className="px-8 py-3 bg-gradient-to-r from-[#fc3c44] to-[#ff2d55] text-white rounded-full font-semibold
                     hover:from-[#ff2d55] hover:to-[#fc3c44] transform transition-all duration-300 hover:scale-105
                     focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                    >
                        Connect to Apple Music
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black">
            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="flex justify-center mb-8">
                    <button
                        onClick={handleUnauthorize}
                        className="px-6 py-2 bg-gray-700 text-white rounded-full font-semibold hover:bg-gray-600
                     transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                        Disconnect from Apple Music
                    </button>
                </div>
                <AppleMusicLibrary />
            </div>
        </div>
    );
};

export default AppleMusicHome;