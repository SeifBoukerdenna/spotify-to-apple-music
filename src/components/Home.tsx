import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { Playlist } from '../interfaces/Playlist.interface';
import { SpotifyUser } from '../interfaces/SpotifyUser.interface';
import LoadingSpinner from './LoadingSpinner';
import PlaylistItem from './PlaylistItem';
import SortingFilteringControls from './SortingFilteringControls';
import UserInfo from './UserInfo';
import { useSpotifyToken } from '../hooks/useSpotifyToken';
import { useSpotifyQuery } from '../hooks/useSpotifyQuery';
import { useSpotifyInfiniteQuery } from '../hooks/useSpotifyInfiniteQuery';
import FileSaver from 'file-saver';
import { Parser } from '@json2csv/plainjs';
import { fetchAllPlaylistTracks } from '../fetch/fetchAllPlaylistTracks';
import { fetchAllLikedSongs } from '../fetch/fetchAllLikedSongs';

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

    // Download metadata for a playlist
    const handleDownload = async (playlist: Playlist) => {
        try {
            const allTracks = await fetchAllPlaylistTracks(playlist.id, token);
            // Map to universally accepted metadata
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

    // Download metadata for Liked Songs
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
        <>
            <header>
                <h1>Spotify User Info</h1>
            </header>
            <div className="container">
                {!token ? (
                    <>
                        {authError ? (
                            <div className="error-message">
                                <p>Error during authentication: {authError}</p>
                                <button onClick={handleLogin}>Try logging in again</button>
                            </div>
                        ) : (
                            <button onClick={handleLogin}>Log in with Spotify</button>
                        )}
                    </>
                ) : (
                    <button onClick={handleLogout}>Log out</button>
                )}

                {isUserLoading && <LoadingSpinner />}
                {userError && <p>Error fetching user information.</p>}
                {user && <UserInfo user={user} />}

                {arePlaylistsLoading && <LoadingSpinner />}
                {playlistsError && <p>Error fetching playlists.</p>}
                {playlists && (
                    <div className="additional-info">
                        <h2>Your Playlists</h2>

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

                        <div className="info-grid">
                            <div className="info-item" style={{ textAlign: 'center' }}>
                                <div
                                    style={{
                                        width: '100%',
                                        height: '150px',
                                        backgroundColor: '#333',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => navigate('/liked-songs')}
                                >
                                    <p style={{ fontSize: '1.5rem', color: '#fff' }}>
                                        <strong>Liked Songs</strong>
                                    </p>
                                </div>
                                <button onClick={handleDownloadLikedSongs}>
                                    Download Metadata
                                </button>
                            </div>
                            {playlists
                                .filter((playlist) =>
                                    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .sort((a, b) => {
                                    if (sortOption === 'name') {
                                        return a.name.localeCompare(b.name);
                                    } else if (sortOption === 'tracks') {
                                        return b.tracks.total - a.tracks.total;
                                    } else {
                                        return 0;
                                    }
                                })
                                .map((playlist) => (
                                    <PlaylistItem
                                        key={playlist.id}
                                        playlist={playlist}
                                        onDownload={handleDownload}
                                    />
                                ))}
                        </div>

                        {hasMorePlaylists && (
                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <button
                                    onClick={() => fetchNextPlaylistsPage()}
                                    disabled={isFetchingNextPlaylistsPage}
                                >
                                    {isFetchingNextPlaylistsPage ? (
                                        <LoadingSpinner size={20} />
                                    ) : (
                                        'Load More'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;
