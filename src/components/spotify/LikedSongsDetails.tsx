import { useNavigate } from "react-router-dom";
import { useTrackDownload } from "../../hooks/useTrackDownload";
import { useSpotifyToken } from "../../hooks/useSpotifyToken";
import { useLikedSongs } from "../../hooks/useLikedSongs";
import { LikedSongsHeader } from "../header/LikedSongsHeader";
import LoadingSpinner from "./LoadingSpinner";
import SortingFilteringControls from "./SortingFilteringControls";
import { TrackGrid } from "../tracks/TrackGrid";

// LikedSongsDetail.tsx
const LikedSongsDetail = () => {
    const navigate = useNavigate();
    const { token } = useSpotifyToken();
    const { handleDownload } = useTrackDownload();

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

    return (
        <div className="bg-gray-900 text-white min-h-screen p-12 font-sans">
            <LikedSongsHeader onBack={() => navigate(-1)} />

            {isLoading && <LoadingSpinner />}
            {error && <p className="text-center text-red-500 mt-4">Error fetching liked songs.</p>}

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

                    <TrackGrid
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