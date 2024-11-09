// src/Home.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { REDIRECT_URI, SPOTIFY_CLIENT_ID } from '../config';

interface SpotifyUser {
    display_name: string;
    email: string;
    images: Array<{ url: string }>;
    followers: { total: number };
    country: string;
    external_urls: { spotify: string };
}

interface Playlist {
    id: string;
    name: string;
    images: Array<{ url: string }>;
    tracks: { total: number };
    external_urls: { spotify: string };
}

const Home: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
    const RESPONSE_TYPE = 'token';
    const SCOPE =
        'user-read-private user-read-email user-top-read user-read-recently-played user-library-read playlist-read-private playlist-read-collaborative';

    const navigate = useNavigate();

    useEffect(() => {
        // Check for access token in URL
        const hash = window.location.hash;
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
    } = useQuery<SpotifyUser>({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await axios.get<SpotifyUser>(
                'https://api.spotify.com/v1/me',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        },
        enabled: !!token,
    });

    // Fetch playlists using React Query
    const {
        data: playlists,
        isLoading: arePlaylistsLoading,
        error: playlistsError,
    } = useQuery<Playlist[]>({
        queryKey: ['playlists'],
        queryFn: async () => {
            let allPlaylists: Playlist[] = [];
            const limit = 50;
            let offset = 0;
            let total = 0;

            do {
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

                allPlaylists = allPlaylists.concat(response.data.items);
                total = response.data.total;
                offset += limit;
            } while (offset < total);

            return allPlaylists;
        },
        enabled: !!token,
    });

    return (
        <>
            <header>
                <h1>Spotify User Info</h1>
            </header>
            <div className="container">
                {!token ? (
                    <button onClick={handleLogin}>Log in with Spotify</button>
                ) : (
                    <button onClick={handleLogout}>Log out</button>
                )}

                {isUserLoading && <p>Loading user information...</p>}
                {userError && <p>Error fetching user information.</p>}
                {user && (
                    <div className="user-info">
                        <h2>Welcome, {user.display_name}</h2>
                        {user.images && user.images.length > 0 && (
                            <img
                                src={user.images[0].url}
                                alt="Profile"
                                className="profile-image"
                            />
                        )}
                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                            <strong>Country:</strong> {user.country}
                        </p>
                        <p>
                            <strong>Followers:</strong> {user.followers.total}
                        </p>
                        <p>
                            <strong>Spotify Profile:</strong>{' '}
                            <a
                                href={user.external_urls.spotify}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {user.external_urls.spotify}
                            </a>
                        </p>
                    </div>
                )}

                {/* Display Playlists */}
                {arePlaylistsLoading && <p>Loading playlists...</p>}
                {playlistsError && <p>Error fetching playlists.</p>}
                {playlists && (
                    <div className="additional-info">
                        <h2>Your Playlists</h2>
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
                            {playlists.map((playlist) => (
                                <div key={playlist.id} className="info-item">
                                    {playlist.images && playlist.images.length > 0 && (
                                        <img
                                            src={playlist.images[0].url}
                                            alt={playlist.name}
                                            style={{ width: '100%', borderRadius: '10px' }}
                                        />
                                    )}
                                    <p>
                                        <strong>{playlist.name}</strong>
                                    </p>
                                    <p>
                                        <strong>Total Tracks:</strong> {playlist.tracks.total}
                                    </p>
                                    <p>
                                        <a
                                            href={playlist.external_urls.spotify}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            View on Spotify
                                        </a>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;
