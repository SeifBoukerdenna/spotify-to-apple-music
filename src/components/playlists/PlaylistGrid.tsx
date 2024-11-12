import { Playlist } from "../../interfaces/Playlist.interface";
import LoadingSpinner from "../spotify/LoadingSpinner";
import PlaylistItem from "../spotify/PlaylistItem";

// components/playlists/PlaylistGrid.tsx
interface PlaylistGridProps {
    playlists: Playlist[];
    onDownload: (playlist: Playlist) => Promise<void>;
    hasMore: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
}

export const PlaylistGrid = ({
    playlists,
    onDownload,
    hasMore,
    isLoadingMore,
    onLoadMore,
}: PlaylistGridProps) => (
    <div>
        <div className="flex flex-wrap gap-4 justify-center mt-4">
            {playlists.map((playlist) => (
                <PlaylistItem
                    key={playlist.id}
                    playlist={playlist}
                    onDownload={onDownload}
                />
            ))}
        </div>

        {hasMore && (
            <div className="text-center mt-4">
                <button
                    onClick={onLoadMore}
                    disabled={isLoadingMore}
                    className="bg-green-500 text-white rounded-lg px-4 py-2 cursor-pointer disabled:opacity-50"
                >
                    {isLoadingMore ? <LoadingSpinner size={20} /> : 'Load More'}
                </button>
            </div>
        )}
    </div>
);