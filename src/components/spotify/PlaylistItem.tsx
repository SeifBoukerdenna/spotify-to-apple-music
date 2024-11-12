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
        <div style={{
            backgroundColor: '#282828',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            width: '200px',
            textAlign: 'center',
            transform: 'scale(1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
        }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            }}>
            {playlist.images && playlist.images.length > 0 && (
                <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    style={{
                        width: '100%',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        transition: 'transform 0.3s ease',
                    }}
                />
            )}
            <p style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#FFFFFF',
                margin: '10px 0 5px',
            }}>
                {playlist.name}
            </p>
            <p style={{
                fontSize: '0.9rem',
                color: '#B3B3B3',
                margin: '5px 0',
            }}>
                <strong>Total Tracks:</strong> {playlist.tracks.total}
            </p>
            <p style={{
                margin: '5px 0',
                fontSize: '0.9rem',
            }}>
                <a href={playlist.external_urls.spotify} target="_blank" rel="noreferrer" style={{
                    color: '#1DB954',
                    textDecoration: 'none',
                }}>
                    View on Spotify
                </a>
            </p>
            <button onClick={handleDownload} disabled={isDownloading} style={{
                backgroundColor: isDownloading ? '#333' : '#1DB954',
                color: '#FFFFFF',
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                cursor: isDownloading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                transition: 'background-color 0.3s ease',
                width: '100%',
                marginTop: '10px',
            }}>
                {isDownloading ? 'Downloading...' : 'Download Metadata'}
            </button>
        </div>
    );
};

export default PlaylistItem;
