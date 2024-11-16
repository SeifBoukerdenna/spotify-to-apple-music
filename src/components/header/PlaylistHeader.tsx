// components/header/PlaylistHeader.tsx
import { Playlist } from '../../interfaces/Playlist.interface';

interface PlaylistHeaderProps {
    playlist: Playlist;
    onBack: () => void;
    isAppleMusic?: boolean;
    onDownload?: () => void;
}


export const PlaylistHeader = ({ playlist, onBack, isAppleMusic = false, onDownload }: PlaylistHeaderProps) => {
    const buttonClasses = isAppleMusic
        ? "mt-6 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full px-5 py-2 hover:from-red-600 hover:to-pink-700 transition-all transform hover:scale-105"
        : "mt-6 bg-green-500 text-white rounded-full px-5 py-2 hover:bg-green-400 transition-all transform hover:scale-105";

    const borderClass = isAppleMusic ? "border-red-700/30" : "border-gray-700";

    return (
        <header className={`text-center pb-6 border-b ${borderClass} mb-10`}>
            <h1 className="text-3xl font-extrabold bg-clip-text">
                {playlist.name}
            </h1>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
                {playlist.description}
            </p>
            <button
                onClick={onBack}
                className={buttonClasses}
            >
                Back
            </button>
            <div className="flex justify-center gap-4">
                <button
                    onClick={onBack}
                    className={`mt-6 ${buttonClasses} text-white rounded-full px-5 py-2 transition-all transform hover:scale-105`}
                >
                    Back
                </button>
                {onDownload && (
                    <button
                        onClick={onDownload}
                        className={`mt-6 ${buttonClasses} text-white rounded-full px-5 py-2 transition-all transform hover:scale-105`}
                    >
                        Download Playlist
                    </button>
                )}
            </div>
        </header>
    );
};