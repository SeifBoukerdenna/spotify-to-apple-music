import { useState } from 'react';
import { Playlist } from '../interfaces/Playlist.interface';

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
        <div className="info-item">
            {playlist.images && playlist.images.length > 0 && (
                <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    style={{ width: '100%', borderRadius: '10px' }}
                />
            )}
            <p>
                <strong>{playlist.name}</strong>
            </p>
            <p>
                <strong>Total Tracks:</strong> {playlist.tracks.total}
            </p>
            <p>
                <a href={playlist.external_urls.spotify} target="_blank" rel="noreferrer">
                    View on Spotify
                </a>
            </p>
            <button onClick={handleDownload} disabled={isDownloading}>
                {isDownloading ? 'Downloading...' : 'Download Metadata'}
            </button>
        </div>
    );
};

export default PlaylistItem;
