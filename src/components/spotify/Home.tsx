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
        <div style={{
            backgroundColor: '#121212',
            color: '#FFFFFF',
            minHeight: '100vh',
            padding: '50px',
            fontFamily: 'Arial, sans-serif',
        }}>
            <header style={{
                textAlign: 'center',
                paddingBottom: '20px',
                borderBottom: '1px solid #282828',
            }}>
                <h1 style={{ fontSize: '2rem', color: '#FFFFFF' }}>Spotify Home</h1>
                {!token ? (
                    authError ? (
                        <div style={{ color: 'red', textAlign: 'center' }}>
                            <p>Error during authentication: {authError}</p>
                            <button onClick={handleLogin} style={{
                                backgroundColor: '#1DB954',
                                color: '#FFFFFF',
                                borderRadius: '50px',
                                padding: '10px 20px',
                                border: 'none',
                                cursor: 'pointer',
                            }}>Try logging in again</button>
                        </div>
                    ) : (
                        <button onClick={handleLogin} style={{
                            backgroundColor: '#1DB954',
                            color: '#FFFFFF',
                            borderRadius: '50px',
                            padding: '10px 20px',
                            border: 'none',
                            cursor: 'pointer',
                        }}>Log in with Spotify</button>
                    )
                ) : (
                    <button onClick={handleLogout} style={{
                        backgroundColor: '#1DB954',
                        color: '#FFFFFF',
                        borderRadius: '50px',
                        padding: '10px 20px',
                        border: 'none',
                        cursor: 'pointer',
                    }}>Log out</button>
                )}
            </header>

            {isUserLoading && <LoadingSpinner />}
            {userError && <p style={{ textAlign: 'center' }}>Error fetching user information.</p>}
            {user && <UserInfo user={user} />}

            {user && <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <button onClick={() => navigate('/create-playlist')} style={{
                    backgroundColor: '#1DB954',
                    color: '#FFFFFF',
                    borderRadius: '50px',
                    padding: '10px 20px',
                    border: 'none',
                    cursor: 'pointer',
                }}>Create New Playlist</button>
            </div>}

            {arePlaylistsLoading && <LoadingSpinner />}
            {playlistsError && <p style={{ textAlign: 'center' }}>Error fetching playlists.</p>}
            {playlists && (
                <div>
                    <h2 style={{ textAlign: 'center', color: '#FFFFFF', fontSize: '1.5rem' }}>Your Playlists</h2>

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

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        justifyContent: 'center',
                        marginTop: '20px',
                    }}>
                        <div style={{
                            width: '100%',
                            maxWidth: '200px',
                            height: '200px',
                            backgroundColor: '#333',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#FFFFFF',
                            textAlign: 'center',
                        }} onClick={() => navigate('/liked-songs')}>
                            <p style={{ fontSize: '1.2rem' }}><strong>Liked Songs</strong></p>
                        </div>
                        <button onClick={handleDownloadLikedSongs} style={{
                            backgroundColor: '#1DB954',
                            color: '#FFFFFF',
                            borderRadius: '10px',
                            padding: '10px 20px',
                            border: 'none',
                            cursor: 'pointer',
                            marginTop: '10px',
                        }}>Download Liked Songs Metadata</button>

                        {playlists.map((playlist) => (
                            <PlaylistItem
                                key={playlist.id}
                                playlist={playlist}
                                onDownload={handleDownload}
                            />
                        ))}
                    </div>

                    {hasMorePlaylists && (
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <button onClick={() => fetchNextPlaylistsPage()} disabled={isFetchingNextPlaylistsPage} style={{
                                backgroundColor: '#1DB954',
                                color: '#FFFFFF',
                                borderRadius: '10px',
                                padding: '10px 20px',
                                border: 'none',
                                cursor: isFetchingNextPlaylistsPage ? 'not-allowed' : 'pointer',
                            }}>
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
