// src/LikedSongsDetail.tsx
import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface Track {
    id: string;
    name: string;
    album: {
        name: string;
        images: Array<{ url: string }>;
    };
    artists: Array<{ name: string }>;
    external_urls: { spotify: string };
}

interface SavedTrackItem {
    track: Track;
}

const LikedSongsDetail: React.FC = () => {
    const navigate = useNavigate();

    const token = window.localStorage.getItem('spotify_access_token');

    // Fetch liked songs using React Query
    const {
        data: likedSongs,
        isLoading,
        error,
    } = useQuery<Track[]>({
        queryKey: ['likedSongs'],
        queryFn: async () => {
            let allTracks: Track[] = [];
            const limit = 50;
            let offset = 0;
            let total = 0;

            do {
                const response = await axios.get<{
                    items: SavedTrackItem[];
                    total: number;
                    next: string | null;
                }>(
                    `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const fetchedTracks = response.data.items.map((item) => item.track);
                allTracks = allTracks.concat(fetchedTracks);
                total = response.data.total;
                offset += limit;
            } while (offset < total);

            return allTracks;
        },
        enabled: !!token,
    });

    return (
        <>
            <header>
                <h1>Liked Songs</h1>
                <button onClick={() => navigate(-1)}>Back</button>
            </header>
            <div className="container">
                {isLoading && <p>Loading liked songs...</p>}
                {error && <p>Error fetching liked songs.</p>}
                {likedSongs && (
                    <div className="info-grid">
                        {likedSongs.map((track) => (
                            <div key={track.id} className="info-item">
                                {track.album.images && track.album.images.length > 0 && (
                                    <img
                                        src={track.album.images[0].url}
                                        alt={track.name}
                                        style={{ width: '100%', borderRadius: '10px' }}
                                    />
                                )}
                                <p>
                                    <strong>{track.name}</strong>
                                </p>
                                <p>{track.artists.map((artist) => artist.name).join(', ')}</p>
                                <p>
                                    <em>{track.album.name}</em>
                                </p>
                                <p>
                                    <a
                                        href={track.external_urls.spotify}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Listen on Spotify
                                    </a>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default LikedSongsDetail;
