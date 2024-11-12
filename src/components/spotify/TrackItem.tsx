// components/tracks/TrackItem.tsx
import { useState } from 'react';
import { Track } from '../../interfaces/Track.interface';
import { FaPlay, FaSpotify, FaDownload } from 'react-icons/fa';

interface TrackItemProps {
    track: Track;
    onDownload: (track: Track) => void;
}

const TrackItem = ({ track, onDownload }: TrackItemProps) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDownloading(true);
        await onDownload(track);
        setIsDownloading(false);
    };

    return (
        <div className="aspect-square group relative rounded-xl overflow-hidden bg-gray-900 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/20">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                {track.album.images && track.album.images.length > 0 && (
                    <img
                        src={track.album.images[0].url}
                        alt={track.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                )}
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="relative h-full p-4 flex flex-col justify-end">
                {/* Play Button - Appears on Hover */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-50">
                    <a
                        href={track.external_urls.spotify}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-500 rounded-full p-4 shadow-lg hover:bg-green-400 transition-colors inline-block"
                    >
                        <FaPlay className="w-6 h-6 text-white ml-1" />
                    </a>
                </div>

                {/* Track Info */}
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-bold text-lg text-white truncate mb-1">
                        {track.name}
                    </p>
                    <p className="text-sm text-gray-300 truncate">
                        {track.artists.map((artist) => artist.name).join(', ')}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 truncate">
                        {track.album.name}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <a
                            href={track.external_urls.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs text-green-400 hover:text-green-300 transition-colors"
                        >
                            <FaSpotify className="w-4 h-4" />
                            <span>Play on Spotify</span>
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

export default TrackItem;