// components/spotify/PlaylistItem.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Playlist } from '../../interfaces/Playlist.interface';
import { FaPlay, FaSpotify, FaDownload } from 'react-icons/fa';

interface PlaylistItemProps {
    playlist: Playlist;
    onDownload: (playlist: Playlist) => Promise<void>;
}

const PlaylistItem = ({ playlist, onDownload }: PlaylistItemProps) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const navigate = useNavigate();

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDownloading(true);
        await onDownload(playlist);
        setIsDownloading(false);
    };

    return (
        <div
            className="aspect-square group relative rounded-xl overflow-hidden bg-gray-900 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/20"
            onClick={() => navigate(`/playlist/${playlist.id}`)}
        >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                {playlist.images && playlist.images.length > 0 ? (
                    <img
                        src={playlist.images[0].url}
                        alt={playlist.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <FaPlay className="w-12 h-12 text-gray-600" />
                    </div>
                )}
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="relative h-full p-4 flex flex-col justify-end">
                {/* Play Button - Appears on Hover */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-50">
                    <div className="bg-green-500 rounded-full p-4 shadow-lg hover:bg-green-400 transition-colors">
                        <FaPlay className="w-6 h-6 text-white ml-1" />
                    </div>
                </div>

                {/* Playlist Info */}
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-bold text-lg text-white truncate mb-1">{playlist.name}</p>
                    <p className="text-sm text-gray-300 truncate">
                        {playlist.tracks.total} tracks
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <a
                            href={playlist.external_urls.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 text-xs text-green-400 hover:text-green-300 transition-colors"
                        >
                            <FaSpotify className="w-4 h-4" />
                            <span>Open in Spotify</span>
                        </a>
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="inline-flex items-center gap-2 text-xs text-green-400 hover:text-green-300 transition-colors disabled:text-gray-500 disabled:cursor-not-allowed"
                        >
                            <FaDownload className="w-4 h-4" />
                            <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaylistItem;