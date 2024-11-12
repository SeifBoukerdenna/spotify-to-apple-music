import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { Playlist } from '../../interfaces/Playlist.interface';
import { SpotifyUser } from '../../interfaces/SpotifyUser.interface';
import { useSpotifyToken } from '../../hooks/useSpotifyToken';
import { useSpotifyQuery } from '../../hooks/useSpotifyQuery';
import { useSpotifyInfiniteQuery } from '../../hooks/useSpotifyInfiniteQuery';
import FileSaver from 'file-saver';
import { Parser } from '@json2csv/plainjs';
import { fetchAllPlaylistTracks } from '../../fetch/fetchAllPlaylistTracks';
import { fetchAllLikedSongs } from '../../fetch/fetchAllLikedSongs';
import LoadingSpinner from './LoadingSpinner';
import PlaylistItem from './PlaylistItem';
import SortingFilteringControls from './SortingFilteringControls';
import UserInfo from './UserInfo';

const Home = () => {
    const { token, authError, handleLogin, handleLogout } = useSpotifyToken();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [sortOption, setSortOption] = useState<'name' | 'tracks' | 'none'>('none');

    const {
        data: user,
        isLoading: isUserLoading,
        error: userError,
    } = useSpotifyQuery<SpotifyUser>(
        token,
        'https://api.spotify.com/v1/me',
        'user',
        !!token
    );

    const {
        items: playlists,
        isLoading: arePlaylistsLoading,
        error: playlistsError,
        fetchNextPage: fetchNextPlaylistsPage,
        hasNextPage: hasMorePlaylists,
        isFetchingNextPage: isFetchingNextPlaylistsPage,
    } = useSpotifyInfiniteQuery<Playlist, Playlist>(
        token,
        'https://api.spotify.com/v1/me/playlists',
        'playlists',
        50,
        !!token,
        0
    );

    useEffect(() => {
        if (
            !arePlaylistsLoading &&
            !isFetchingNextPlaylistsPage &&
            hasMorePlaylists &&
            debouncedSearchTerm
        ) {
            const filteredPlaylists = playlists.filter((playlist) =>
                playlist.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );

            if (filteredPlaylists.length === 0) {
                fetchNextPlaylistsPage();
            }
        }
    }, [
        debouncedSearchTerm,
        playlists,
        arePlaylistsLoading,
        isFetchingNextPlaylistsPage,
        hasMorePlaylists,
        fetchNextPlaylistsPage,
    ]);

    const handleDownload = async (playlist: Playlist) => {
        try {
            const allTracks = await fetchAllPlaylistTracks(playlist.id, token);
            const tracksData = allTracks.map((item) => {
                const track = item.track;
                return {
                    song: track.name,
                    artist: track.artists.map((a) => a.name).join(', '),
                    album: track.album.name,
                    year: track.album.release_date ? track.album.release_date.slice(0, 4) : '',
                };
            });

            const json2csvParser = new Parser();
            const csvData = json2csvParser.parse(tracksData);

            const blob = new Blob([csvData], {
                type: 'text/csv;charset=utf-8',
            });
            FileSaver.saveAs(blob, `${playlist.name}-metadata.csv`);
        } catch (error) {
            console.error('Error fetching playlist tracks:', error);
            alert('Failed to download playlist metadata.');
        }
    };

    const handleDownloadLikedSongs = async () => {
        try {
            const allLikedSongs = await fetchAllLikedSongs(token);
            const tracksData = allLikedSongs.map((track) => ({
                song: track.name,
                artist: track.artists.map((a) => a.name).join(', '),
                album: track.album.name,
                year: track.album.release_date ? track.album.release_date.slice(0, 4) : '',
            }));

            const json2csvParser = new Parser();
            const csvData = json2csvParser.parse(tracksData);

            const blob = new Blob([csvData], {
                type: 'text/csv;charset=utf-8',
            });
            FileSaver.saveAs(blob, `Liked-Songs-metadata.csv`);
        } catch (error) {
            console.error('Error fetching liked songs:', error);
            alert('Failed to download liked songs metadata.');
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-12 font-sans">
            <header className="text-center pb-5 border-b border-gray-700">
                <h1 className="text-2xl">Spotify Home</h1>
                {!token ? (
                    authError ? (
                        <div className="text-red-500 text-center">
                            <p>Error during authentication: {authError}</p>
                            <button onClick={handleLogin} className="bg-green-500 text-white rounded-full px-5 py-2 mt-2 cursor-pointer">
                                Try logging in again
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleLogin} className="bg-green-500 text-white rounded-full px-5 py-2 mt-2 cursor-pointer">
                            Log in with Spotify
                        </button>
                    )
                ) : (
                    <button onClick={handleLogout} className="bg-green-500 text-white rounded-full px-5 py-2 mt-2 cursor-pointer">
                        Log out
                    </button>
                )}
            </header>

            {isUserLoading && <LoadingSpinner />}
            {userError && <p className="text-center">Error fetching user information.</p>}
            {user && <UserInfo user={user} />}

            {user && (
                <div className="text-center mt-5">
                    <button onClick={() => navigate('/create-playlist')} className="bg-green-500 text-white rounded-full px-5 py-2 mt-2 cursor-pointer">
                        Create New Playlist
                    </button>
                </div>
            )}

            {arePlaylistsLoading && <LoadingSpinner />}
            {playlistsError && <p className="text-center">Error fetching playlists.</p>}
            {playlists && (
                <div>
                    <h2 className="text-center text-xl mt-8">Your Playlists</h2>

                    <SortingFilteringControls<'name' | 'tracks' | 'none'>
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
                        {/* Liked Songs Item */}
                        {user?.images && user.images.length > 0 && (
                            <div
                                className="w-full max-w-xs rounded-lg p-4 flex flex-col items-center text-center cursor-pointer bg-cover bg-center relative overflow-hidden transition-transform transform hover:scale-105"
                                style={{
                                    backgroundImage: `url(${user.images[0].url})`,
                                }}
                                onClick={() => navigate('/liked-songs')}
                            >
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md rounded-lg"></div>

                                {/* Content */}
                                <div className="relative z-10 flex-1 flex items-center justify-center h-24">
                                    <p className="text-xl font-bold">Liked Songs</p>
                                </div>

                                <button onClick={(e) => { e.stopPropagation(); handleDownloadLikedSongs(); }} className="relative z-10 bg-green-500 text-white rounded-lg px-4 py-2 cursor-pointer mt-3 w-full">
                                    Download Liked Songs Metadata
                                </button>
                            </div>
                        )}

                        {playlists.map((playlist) => (
                            <PlaylistItem
                                key={playlist.id}
                                playlist={playlist}
                                onDownload={handleDownload}
                            />
                        ))}
                    </div>

                    {hasMorePlaylists && (
                        <div className="text-center mt-4">
                            <button onClick={() => fetchNextPlaylistsPage()} disabled={isFetchingNextPlaylistsPage} className="bg-green-500 text-white rounded-lg px-4 py-2 cursor-pointer disabled:opacity-50">
                                {isFetchingNextPlaylistsPage ? <LoadingSpinner size={20} /> : 'Load More'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
