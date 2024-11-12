import { useState } from 'react';
import { Playlist } from '../../interfaces/Playlist.interface';

interface PlaylistItemProps {
    playlist: Playlist;
    onDownload: (playlist: Playlist) => Promise<void>;
}

const PlaylistItem = ({ playlist, onDownload }: PlaylistItemProps) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        await onDownload(playlist);
        setIsDownloading(false);
    };

    return (
        <div
            className="bg-gray-800 p-5 rounded-lg shadow-md w-52 text-center transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer"
        >
            {playlist.images && playlist.images.length > 0 && (
                <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="w-full rounded-md mb-3 transition-transform duration-300"
                />
            )}
            <p className="text-lg font-bold text-white mb-2">
                {playlist.name}
            </p>
            <p className="text-sm text-gray-400 mb-2">
                <strong>Total Tracks:</strong> {playlist.tracks.total}
            </p>
            <p className="text-sm mb-3">
                <a
                    href={playlist.external_urls.spotify}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-500 hover:underline"
                >
                    View on Spotify
                </a>
            </p>
            <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`w-full py-2 rounded-full text-white text-sm font-medium transition-colors duration-300 ${isDownloading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400'}`}
            >
                {isDownloading ? 'Downloading...' : 'Download Metadata'}
            </button>
        </div>
    );
};

export default PlaylistItem;
