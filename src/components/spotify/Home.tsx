import { useNavigate } from "react-router-dom";
import { useMetadataDownload } from "../../hooks/useMetadataDownload";
import { useSpotifyQuery } from "../../hooks/useSpotifyQuery";
import { SpotifyUser } from "../../interfaces/SpotifyUser.interface";
import { usePlaylistManagement } from "../../hooks/usePlaylistManagement";
import { HomeHeader } from "../header/HomeHeader";
import LoadingSpinner from "./LoadingSpinner";
import UserInfo from "./UserInfo";
import SortingFilteringControls from "./SortingFilteringControls";
import { LikedSongsCard } from "../playlists/LikedSongsCard";
import { PlaylistGrid } from "../playlists/PlaylistGrid";
import { useSpotifyToken } from "../../hooks/useSpotifyToken";

const Home = () => {
    const navigate = useNavigate();
    const { token, authError, handleLogin, handleLogout } = useSpotifyToken();

    const {
        searchTerm,
        setSearchTerm,
        sortOption,
        setSortOption,
        playlists,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = usePlaylistManagement(token);

    const { handlePlaylistDownload, handleLikedSongsDownload } = useMetadataDownload(token);

    const { data: user, isLoading: isUserLoading, error: userError } = useSpotifyQuery<SpotifyUser>(
        token,
        'https://api.spotify.com/v1/me',
        'user',
        !!token
    );

    return (
        <div className="bg-gray-900 text-white min-h-screen p-12 font-sans">
            <HomeHeader
                token={token}
                authError={authError}
                onLogin={handleLogin}
                onLogout={handleLogout}
            />

            {isUserLoading && <LoadingSpinner />}
            {userError && <p className="text-center">Error fetching user information.</p>}
            {user && (
                <>
                    <UserInfo user={user} />

                    <div className="text-center mt-5">
                        <button
                            onClick={() => navigate('/create-playlist')}
                            className="bg-green-500 text-white rounded-full px-5 py-2 mt-2 cursor-pointer"
                        >
                            Create New Playlist
                        </button>
                    </div>
                </>
            )}

            {isLoading && <LoadingSpinner />}
            {error && <p className="text-center">Error fetching playlists.</p>}
            {playlists && (
                <div>
                    <h2 className="text-center text-xl mt-8">Your Playlists</h2>

                    <SortingFilteringControls
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        sortOption={sortOption}
                        setSortOption={setSortOption}
                        sortOptions={[
                            { value: 'none', label: 'None' },
                            { value: 'name', label: 'Name' },
                            { value: 'tracks', label: 'Number of Tracks' },
                        ]}
                        placeholder="Search playlists..."
                    />

                    <div className="flex flex-wrap gap-4 justify-center mt-4">
                        {user?.images && user.images.length > 0 && (
                            <LikedSongsCard
                                userImage={user.images[0].url}
                                onNavigate={() => navigate('/liked-songs')}
                                onDownload={handleLikedSongsDownload}
                            />
                        )}

                        <PlaylistGrid
                            playlists={playlists}
                            onDownload={handlePlaylistDownload}
                            hasMore={hasNextPage}
                            isLoadingMore={isFetchingNextPage}
                            onLoadMore={() => fetchNextPage()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;