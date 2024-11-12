import { useState } from 'react';
import { Playlist } from '../../interfaces/Playlist.interface';
import { useNavigate } from 'react-router-dom';

interface PlaylistItemProps {
    playlist: Playlist;
    onDownload: (playlist: Playlist) => Promise<void>;
}

const PlaylistItem = ({ playlist, onDownload }: PlaylistItemProps) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const navigate = useNavigate();

    const handleDownload = async () => {
        setIsDownloading(true);
        await onDownload(playlist);
        setIsDownloading(false);
    };

    return (
        <div
            className="bg-gray-800 p-4 rounded-lg shadow-md w-64 text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-xl relative cursor-pointer"
            onClick={() => navigate(`/playlist/${playlist.id}`)}
        >
            {/* Playlist Image with Overlay */}
            <div className="relative w-full h-52">
                {playlist.images && playlist.images.length > 0 && (
                    <img
                        src={playlist.images[0].url}
                        alt={playlist.name}
                        className="w-full h-full object-cover rounded-md"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-md"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="font-semibold text-lg truncate">{playlist.name}</p>
                    <p className="text-sm text-gray-300">
                        <strong>Total Tracks:</strong> {playlist.tracks.total}
                    </p>
                    <p className="text-sm text-blue-400 underline">
                        <a href={playlist.external_urls.spotify} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                            View on Spotify
                        </a>
                    </p>
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                }}
                disabled={isDownloading}
                className={`w-full bg-green-500 text-white rounded-lg py-2 mt-4 transition-colors duration-300 ${isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-400'
                    }`}
            >
                {isDownloading ? 'Downloading...' : 'Download Metadata'}
            </button>
        </div>
    );
};

export default PlaylistItem;
