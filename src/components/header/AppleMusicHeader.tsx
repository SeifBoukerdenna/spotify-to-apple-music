// components/appleMusic/AppleMusicHeader.tsx
import { useMusicKit } from '../../hooks/useMusicKit';

export const AppleMusicHeader = () => {
    const { isAuthorized, handleAuthorize, handleUnauthorize } = useMusicKit();

    return (
        <header className="bg-gradient-to-b from-red-500 to-pink-600 text-white p-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-3xl font-bold">Apple Music</h1>
                <button
                    onClick={isAuthorized ? handleUnauthorize : handleAuthorize}
                    className="px-6 py-2 bg-white text-red-500 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                    {isAuthorized ? 'Disconnect' : 'Connect to Apple Music'}
                </button>
            </div>
        </header>
    );
};