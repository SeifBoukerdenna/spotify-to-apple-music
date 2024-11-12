// components/tracks/LikedTracksGrid.tsx
import { useEffect, useRef, useCallback, useMemo } from "react";
import { Track } from "../../interfaces/Track.interface";
import LoadingSpinner from "../spotify/LoadingSpinner";
import TrackItem from "../spotify/TrackItem";

interface LikedTracksGridProps {
    tracks: Track[];
    onDownload: (track: Track) => void;
    hasMore: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
    searchTerm: string;
    sortOption: 'none' | 'name' | 'artist' | 'album';
}

export const LikedTracksGrid = ({
    tracks,
    onDownload,
    hasMore,
    isLoadingMore,
    onLoadMore,
    searchTerm,
    sortOption,
}: LikedTracksGridProps) => {
    const loaderRef = useRef<HTMLDivElement>(null);

    // Filter and sort tracks
    const filteredAndSortedTracks = useMemo(() => {
        let result = [...tracks];

        // Filter based on search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter((track) =>
                track.name.toLowerCase().includes(searchLower) ||
                track.artists.some((artist) =>
                    artist.name.toLowerCase().includes(searchLower)
                ) ||
                track.album.name.toLowerCase().includes(searchLower)
            );
        }

        // Sort based on selected option
        if (sortOption !== 'none') {
            result.sort((a, b) => {
                if (sortOption === 'name') {
                    return a.name.localeCompare(b.name);
                } else if (sortOption === 'artist') {
                    return a.artists[0].name.localeCompare(b.artists[0].name);
                } else if (sortOption === 'album') {
                    return a.album.name.localeCompare(b.album.name);
                }
                return 0;
            });
        }

        return result;
    }, [tracks, searchTerm, sortOption]);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting && hasMore && !isLoadingMore && !searchTerm) {
                onLoadMore();
            }
        },
        [hasMore, isLoadingMore, onLoadMore, searchTerm]
    );

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

    if (filteredAndSortedTracks.length === 0 && searchTerm) {
        return (
            <div className="text-center text-gray-400 py-8">
                No tracks found matching "{searchTerm}"
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredAndSortedTracks.map((track) => (
                    <TrackItem key={track.id} track={track} onDownload={onDownload} />
                ))}
            </div>

            {hasMore && !searchTerm && (
                <div
                    ref={loaderRef}
                    className="flex justify-center items-center py-8"
                >
                    {isLoadingMore && <LoadingSpinner size={24} />}
                </div>
            )}
        </>
    );
};
