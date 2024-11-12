// PlaylistBuilder.tsx
import { Track } from '../../interfaces/Track.interface';

interface PlaylistBuilderProps {
    tracks: Track[];
    onRemoveTrack: (trackId: string) => void;
}

const PlaylistBuilder = ({ tracks, onRemoveTrack }: PlaylistBuilderProps) => {
    return (
        <div className="playlist-builder">
            <h2>Selected Tracks ({tracks.length})</h2>
            <div className="selected-tracks-list">
                {tracks.map((track) => (
                    <div key={track.id} className="selected-track-item">
                        {track.album.images && track.album.images.length > 0 && (
                            <img
                                src={track.album.images[track.album.images.length - 1].url}
                                alt={track.name}
                                className="track-thumbnail"
                            />
                        )}
                        <div className="track-info">
                            <p className="track-name">{track.name}</p>
                            <p className="track-artist">
                                {track.artists.map((artist) => artist.name).join(', ')}
                            </p>
                        </div>
                        <button
                            onClick={() => onRemoveTrack(track.id)}
                            className="remove-track-button"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlaylistBuilder;