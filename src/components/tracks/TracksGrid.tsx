// components/tracks/TrackGrid.tsx
import { Track } from '../../interfaces/Track.interface';
import { TrackCard } from './tracksCard';

interface TrackGridProps {
    tracks: Track[];
}

export const TrackGrid = ({ tracks }: TrackGridProps) => (
    <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
            ))}
        </div>
    </div>
);