// components/appleMusic/AppleMusicPlaylistCard.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaDownload } from 'react-icons/fa';
import { AppleMusicIcon } from '../../icons/AppleMusicIcon';
import { useNavigate } from 'react-router-dom';

interface AppleMusicPlaylistCardProps {
    playlist: MusicKit.Resource<MusicKit.PlaylistAttributes>;
    onDownload?: (playlist: MusicKit.Resource<MusicKit.PlaylistAttributes>) => Promise<void>;
}

export const AppleMusicPlaylistCard = ({ playlist, onDownload }: AppleMusicPlaylistCardProps) => {
    const navigate = useNavigate();
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleClick = () => {
        navigate(`/apple-music/playlist/${playlist.id}`);
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDownload) {
            setIsDownloading(true);
            setDownloadError(null);
            try {
                await onDownload(playlist);
            } catch (error) {
                console.error('Download failed:', error);
                setDownloadError('Failed to download. Try from playlist page.');
                // Auto-hide error after 3 seconds
                setTimeout(() => setDownloadError(null), 3000);
            } finally {
                setIsDownloading(false);
            }
        }
    };

    return (
        <motion.div
            onClick={handleClick}
            whileHover={{ scale: 1.02 }}
            className="aspect-square group relative rounded-xl overflow-hidden bg-gray-900 cursor-pointer
                 transform transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20"
        >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                {playlist.attributes.artwork ? (
                    <img
                        src={playlist.attributes.artwork.url.replace('{w}', '400').replace('{h}', '400')}
                        alt={playlist.attributes.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                        <AppleMusicIcon className="w-12 h-12 text-white/50" />
                    </div>
                )}
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent
                      opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="relative h-full p-4 flex flex-col justify-end">
                {/* Play Button - Appears on Hover */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      opacity-0 group-hover:opacity-100 transition-all duration-300
                      transform group-hover:scale-100 scale-50">
                    <div className="bg-red-500 rounded-full p-4 shadow-lg hover:bg-red-400
                        transition-colors cursor-pointer">
                        <FaPlay className="w-6 h-6 text-white ml-1" />
                    </div>
                </div>

                {/* Playlist Info */}
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-bold text-lg text-white truncate mb-1">
                        {playlist.attributes.name}
                    </h3>
                    <p className="text-sm text-gray-300 truncate">
                        {playlist.attributes.trackCount} tracks
                    </p>
                    {playlist.attributes.description && (
                        <p className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100
                         transition-opacity duration-300 line-clamp-2">
                            {playlist.attributes.description.standard}
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button className="inline-flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors">
                                <AppleMusicIcon className="w-4 h-4" />
                                <span>Play in Apple Music</span>
                            </button>

                            {onDownload && (
                                <button
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className="inline-flex items-center gap-2 text-xs text-red-400 hover:text-red-300
                                        transition-colors disabled:text-gray-500 disabled:cursor-not-allowed"
                                >
                                    <FaDownload className="w-4 h-4" />
                                    <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
                                </button>
                            )}
                        </div>
                        {/* Error Message */}
                        {downloadError && (
                            <div className="text-xs text-red-400 opacity-100 transition-opacity duration-300">
                                {downloadError}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};