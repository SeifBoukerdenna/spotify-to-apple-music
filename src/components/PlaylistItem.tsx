import { Playlist } from '../interfaces/Playlist.interface';

interface PlaylistItemProps {
    playlist: Playlist;
}

const PlaylistItem = ({ playlist }: PlaylistItemProps) => (
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
    </div>
);

export default PlaylistItem;
