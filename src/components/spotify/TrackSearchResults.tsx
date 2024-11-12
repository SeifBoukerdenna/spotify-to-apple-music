// TrackSearchResults.tsx
import { Track } from '../../interfaces/Track.interface';

interface TrackSearchResultsProps {
    tracks: Track[];
    onAddTrack: (track: Track) => void;
    selectedTracks: Track[];
}

const TrackSearchResults = ({
    tracks,
    onAddTrack,
    selectedTracks,
}: TrackSearchResultsProps) => {
    return (
        <div className="track-search-results">
            {tracks.map((track) => (
                <div key={track.id} className="track-result-item">
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
                        onClick={() => onAddTrack(track)}
                        disabled={selectedTracks.some((t) => t.id === track.id)}
                        className="add-track-button"
                    >
                        {selectedTracks.some((t) => t.id === track.id) ? 'Added' : 'Add'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default TrackSearchResults;