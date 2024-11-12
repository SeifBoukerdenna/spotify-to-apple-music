import { Track } from "../../interfaces/Track.interface";
import LoadingSpinner from "../spotify/LoadingSpinner";
import TrackItem from "../spotify/TrackItem";

// components/tracks/TrackGrid.tsx
interface TrackGridProps {
    tracks: Track[];
    onDownload: (track: Track) => void;
    hasMore: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
}

export const TrackGrid = ({
    tracks,
    onDownload,
    hasMore,
    isLoadingMore,
    onLoadMore,
}: TrackGridProps) => (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {tracks.map((track) => (
                <TrackItem key={track.id} track={track} onDownload={onDownload} />
            ))}
        </div>

        {hasMore && (
            <div className="text-center mt-6">
                <button
                    onClick={onLoadMore}
                    disabled={isLoadingMore}
                    className={`bg-green-500 text-white rounded-lg px-6 py-2 font-medium transition-colors ${isLoadingMore ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-400'
                        }`}
                >
                    {isLoadingMore ? <LoadingSpinner size={20} /> : 'Load More'}
                </button>
            </div>
        )}
    </>
);
