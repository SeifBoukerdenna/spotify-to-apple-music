import { Track } from '../interfaces/Track.interface';

interface TrackItemProps {
    track: Track;
}

const TrackItem = ({ track }: TrackItemProps) => (
    <div key={track.id} className="info-item">
        {track.album.images && track.album.images.length > 0 && (
            <img
                src={track.album.images[0].url}
                alt={track.name}
                style={{ width: '100%', borderRadius: '10px' }}
            />
        )}
        <p>
            <strong>{track.name}</strong>
        </p>
        <p>{track.artists.map((artist) => artist.name).join(', ')}</p>
        <p>
            <em>{track.album.name}</em>
        </p>
        <p>
            <a href={track.external_urls.spotify} target="_blank" rel="noreferrer">
                Listen on Spotify
            </a>
        </p>
    </div>
);

export default TrackItem;
