import { useMusicKit } from '../../hooks/useMusicKit';

const AppleMusicHome = () => {
    const { handleAuthorize } = useMusicKit();

    return (
        <div className="flex items-center justify-center text-white font-sans">
            <div className="text-center w-full max-w-md px-4">
                <h1 className="text-4xl font-semibold mb-6 text-white">Apple Music</h1>
                <button
                    onClick={handleAuthorize}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 transition text-white py-3 rounded-full shadow-lg text-lg font-semibold mt-4 mb-4 px-6"
                >
                    Connect to Apple Music
                </button>
            </div>
        </div>
    );
};

export default AppleMusicHome;
