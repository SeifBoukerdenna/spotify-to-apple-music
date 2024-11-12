// components/spotify/LikedSongsDetail.tsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTrackDownload } from "../../hooks/useTrackDownload";
import { useSpotifyToken } from "../../hooks/useSpotifyToken";
import { useLikedSongs } from "../../hooks/useLikedSongs";
import { LikedSongsHeader } from "../header/LikedSongsHeader";
import LoadingSpinner from "./LoadingSpinner";
import SortingFilteringControls from "./SortingFilteringControls";
import { LikedTracksGrid } from "../tracks/LikedTracksGrid";

const LikedSongsDetail = () => {
    const navigate = useNavigate();
    const { token } = useSpotifyToken();
    const { handleDownload } = useTrackDownload();
    const scrollRestoredRef = useRef(false);

    const {
        searchTerm,
        setSearchTerm,
        sortOption,
        setSortOption,
        likedSongs,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useLikedSongs(token);

    // Handle scroll position restoration
    useEffect(() => {
        let timeoutId: number;

        if (!isLoading && likedSongs.length > 0 && !scrollRestoredRef.current) {
            timeoutId = window.setTimeout(() => {
                const savedScrollPos = sessionStorage.getItem('likedSongsScrollPos');
                if (savedScrollPos) {
                    window.scrollTo(0, parseInt(savedScrollPos));
                }
                scrollRestoredRef.current = true;
            }, 100);
        }

        return () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
        };
    }, [isLoading, likedSongs]);

    // Save scroll position when leaving the page
    useEffect(() => {
        const handleBeforeUnload = () => {
            sessionStorage.setItem('likedSongsScrollPos', window.scrollY.toString());
        };

        // Save scroll position on component unmount as well
        const handleComponentUnmount = () => {
            sessionStorage.setItem('likedSongsScrollPos', window.scrollY.toString());
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            handleComponentUnmount();
        };
    }, []);

    return (
        <div className="bg-gray-900 text-white min-h-screen p-12 font-sans">
            <LikedSongsHeader onBack={() => {
                // Save scroll position before navigating back
                sessionStorage.setItem('likedSongsScrollPos', window.scrollY.toString());
                navigate(-1);
            }} />

            {isLoading && <LoadingSpinner />}
            {error && (
                <p className="text-center text-red-500 mt-4">
                    Error fetching liked songs.
                </p>
            )}

            {likedSongs && (
                <>
                    <SortingFilteringControls
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        sortOption={sortOption}
                        setSortOption={setSortOption}
                        sortOptions={[
                            { value: 'none', label: 'None' },
                            { value: 'name', label: 'Name' },
                            { value: 'artist', label: 'Artist' },
                            { value: 'album', label: 'Album' },
                        ]}
                        placeholder="Search songs..."
                    />

                    <LikedTracksGrid
                        tracks={likedSongs}
                        onDownload={handleDownload}
                        hasMore={hasNextPage}
                        isLoadingMore={isFetchingNextPage}
                        onLoadMore={() => fetchNextPage()}
                    />
                </>
            )}
        </div>
    );
};

export default LikedSongsDetail;