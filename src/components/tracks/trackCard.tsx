// components/tracks/TrackCard.tsx
import { Track } from '../../interfaces/Track.interface';

interface TrackCardProps {
    track: Track;
}

export const TrackCard = ({ track }: TrackCardProps) => (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transform transition-all duration-200 hover:scale-105 relative">
        {track.album.images.length > 0 && (
            <img
                src={track.album.images[0].url}
                alt={track.album.name}
                className="w-full h-40 object-cover opacity-90"
            />
        )}
        <div className="p-4 bg-gradient-to-t from-black via-gray-800 to-transparent absolute inset-0 flex flex-col justify-end text-white">
            <p className="font-bold text-lg truncate">{track.name}</p>
            <p className="text-sm text-gray-300 truncate">
                {track.artists.map((artist) => artist.name).join(', ')}
            </p>
            <p className="text-xs text-gray-400 mt-1">{track.album.name}</p>
        </div>
    </div>
);