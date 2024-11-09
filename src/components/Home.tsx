import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { SPOTIFY_CLIENT_ID, REDIRECT_URI } from '../config';
import { Playlist } from '../interfaces/Playlist.interface';
import { SpotifyUser } from '../interfaces/SpotifyUser.interface';
import LoadingSpinner from './LoadingSpinner';
import PlaylistItem from './PlaylistItem';
import SortingFilteringControls from './SortingFilteringControls';
import UserInfo from './UserInfo';

const Home = () => {
    const [token, setToken] = useState<string | null>(null);
    const [authError, setAuthError] = useState<string | null>(null); // Error state
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
    const RESPONSE_TYPE = 'token';
    const SCOPE =
        'user-read-private user-read-email user-top-read user-read-recently-played user-library-read playlist-read-private playlist-read-collaborative';

    const navigate = useNavigate();

    // State for sorting and filtering playlists
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [sortOption, setSortOption] = useState<'name' | 'tracks' | 'none'>('none');

    useEffect(() => {
        // Check for access token in URL hash or error in URL query parameters
        const hash = window.location.hash;
        const search = window.location.search;
        let accessToken = window.localStorage.getItem('spotify_access_token');

        if (!accessToken && hash) {
            accessToken = new URLSearchParams(hash.substring(1)).get('access_token');
            window.location.hash = '';
            if (accessToken) {
                window.localStorage.setItem('spotify_access_token', accessToken);
                setToken(accessToken);
            }
        } else if (accessToken) {
            setToken(accessToken);
        }

        if (search) {
            const error = new URLSearchParams(search).get('error');
            if (error) {
                setAuthError(error);
                // Clear the search parameters to clean up the URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }, []);

    const handleLogin = () => {
        const authUrl = `${AUTH_ENDPOINT}?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(
            REDIRECT_URI
        )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}`;
        window.location.href = authUrl;
    };

    const handleLogout = () => {
        setToken(null);
        window.localStorage.removeItem('spotify_access_token');
        window.location.reload();
    };

    // Fetch user data using React Query
    const {
        data: user,
        isLoading: isUserLoading,
        error: userError,
    } = useQuery<SpotifyUser, Error>({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await axios.get<SpotifyUser>('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        },
        enabled: !!token,
    });

    // Fetch playlists using React Query
    const {
        data: playlistsData,
        isLoading: arePlaylistsLoading,
        error: playlistsError,
        fetchNextPage: fetchNextPlaylistsPage,
        hasNextPage: hasMorePlaylists,
        isFetchingNextPage: isFetchingNextPlaylistsPage,
    } = useInfiniteQuery<{
        items: Playlist[];
        next: string | null;
    }, Error>({
        queryKey: ['playlists'],
        queryFn: async ({ pageParam = 0 }) => {
            const limit = 50;
            const offset = pageParam;
            const response = await axios.get<{
                items: Playlist[];
                total: number;
                next: string | null;
            }>(
                `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return {
                items: response.data.items,
                next: response.data.next,
            };
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.next) {
                const url = new URL(lastPage.next);
                const offsetParam = url.searchParams.get('offset');
                return offsetParam ? parseInt(offsetParam, 10) : undefined;
            } else {
                return undefined;
            }
        },
        enabled: !!token,
        initialPageParam: 0,
    });

    // Combine pages of data
    const playlists = React.useMemo(() => playlistsData?.pages.flatMap((page) => page.items) || [], [playlistsData]);

    // Effect to load more data when search yields no results
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
                // Fetch more pages if available
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

                {/* Display Playlists */}
                {arePlaylistsLoading && <LoadingSpinner />}
                {playlistsError && <p>Error fetching playlists.</p>}
                {playlists && (
                    <div className="additional-info">
                        <h2>Your Playlists</h2>

                        {/* Sorting and Filtering Controls */}
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
                            {/* Liked Songs Playlist */}
                            <div
                                className="info-item"
                                style={{ cursor: 'pointer', textAlign: 'center' }}
                                onClick={() => navigate('/liked-songs')}
                            >
                                <div
                                    style={{
                                        width: '100%',
                                        height: '150px',
                                        backgroundColor: '#333',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <p style={{ fontSize: '1.5rem', color: '#fff' }}>
                                        <strong>Liked Songs</strong>
                                    </p>
                                </div>
                            </div>
                            {/* User's Playlists */}
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
                                    <PlaylistItem key={playlist.id} playlist={playlist} />
                                ))}
                        </div>

                        {/* Load More Button */}
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
