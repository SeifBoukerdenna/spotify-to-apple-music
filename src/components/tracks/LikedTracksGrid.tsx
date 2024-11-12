// components/tracks/LikedTracksGrid.tsx
import { Track } from "../../interfaces/Track.interface";
import LoadingSpinner from "../spotify/LoadingSpinner";
import TrackItem from "../spotify/TrackItem";

interface LikedTracksGridProps {
    tracks: Track[];
    onDownload: (track: Track) => void;
    hasMore: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
}

export const LikedTracksGrid = ({
    tracks,
    onDownload,
    hasMore,
    isLoadingMore,
    onLoadMore,
}: LikedTracksGridProps) => (
    <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tracks.map((track) => (
                <TrackItem key={track.id} track={track} onDownload={onDownload} />
            ))}
        </div>
        {hasMore && (
            <div className="text-center mt-8">
                <button
                    onClick={onLoadMore}
                    disabled={isLoadingMore}
                    className={`
            px-8 py-3 rounded-full font-medium text-white
            transform transition-all duration-300
            ${isLoadingMore
                            ? 'bg-gray-700 cursor-not-allowed opacity-50'
                            : 'bg-green-500 hover:bg-green-400 hover:scale-105 shadow-lg hover:shadow-green-500/20'
                        }
          `}
                >
                    {isLoadingMore ? <LoadingSpinner size={20} /> : 'Load More'}
                </button>
            </div>
        )}
    </>
);