// components/playlists/PlaylistGrid.tsx
import { useEffect, useRef, useCallback } from "react";
import { Playlist } from "../../interfaces/Playlist.interface";
import LoadingSpinner from "../spotify/LoadingSpinner";
import PlaylistItem from "../spotify/PlaylistItem";

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
}: PlaylistGridProps) => {
    // Reference for infinite scroll
    const loaderRef = useRef<HTMLDivElement>(null);

    // Intersection Observer callback
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting && hasMore && !isLoadingMore) {
                onLoadMore();
            }
        },
        [hasMore, isLoadingMore, onLoadMore]
    );

    // Set up the Intersection Observer
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "200px",
            threshold: 0.1,
        };

        const observer = new IntersectionObserver(handleObserver, options);

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [handleObserver]);

    return (
        <div className="max-w-screen-xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {playlists.map((playlist) => (
                    <PlaylistItem
                        key={playlist.id}
                        playlist={playlist}
                        onDownload={onDownload}
                    />
                ))}
            </div>

            {/* Infinite Scroll Loader */}
            {hasMore && (
                <div
                    ref={loaderRef}
                    className="flex justify-center items-center py-8"
                >
                    {isLoadingMore && <LoadingSpinner size={24} />}
                </div>
            )}
        </div>
    );
};
