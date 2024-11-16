// components/tracks/PlaylistTracksGrid.tsx
import { Track } from '../../interfaces/Track.interface';
import { TrackCard } from './TrackCard';

interface PlaylistTracksGridProps {
    tracks: Track[];
    isAppleMusic?: boolean;
    onTrackDownload?: (track: Track) => void;
}

export const PlaylistTracksGrid = ({ tracks, isAppleMusic = false }: PlaylistTracksGridProps) => (
    <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tracks.map((track) => (
                <TrackCard key={track.id} track={track} isAppleMusic={isAppleMusic} />
            ))}
        </div>
    </div>
);
