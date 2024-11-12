import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Playlist } from '../../interfaces/Playlist.interface';
import { Track } from '../../interfaces/Track.interface';
import { useSpotifyToken } from '../../hooks/useSpotifyToken';
import LoadingSpinner from './LoadingSpinner';
import { PlaylistTrack } from '../../interfaces/PlaylistTrack.interface';

const PlaylistDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { token } = useSpotifyToken();
    const navigate = useNavigate();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [playlistInfo, setPlaylistInfo] = useState<Playlist | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylistData = async () => {
            if (!token || !id) return;

            try {
                const playlistResponse = await axios.get<{
                    tracks: { items: PlaylistTrack[] };
                } & Playlist>(
                    `https://api.spotify.com/v1/playlists/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPlaylistInfo(playlistResponse.data);
                setTracks(playlistResponse.data.tracks.items.map((item) => item.track));
            } catch (error) {
                console.error('Error fetching playlist data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylistData();
    }, [token, id]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8">
            <header className="text-center pb-5 border-b border-gray-700 mb-8">
                <h1 className="text-2xl font-bold">{playlistInfo?.name}</h1>
                <p className="text-gray-400">{playlistInfo?.description}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 bg-green-500 text-white rounded-full px-6 py-2 cursor-pointer hover:bg-green-400 transition-colors"
                >
                    Back
                </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tracks.map((track) => (
                    <div key={track.id} className="bg-gray-800 rounded-lg p-4 shadow-md">
                        <p className="font-semibold">{track.name}</p>
                        <p className="text-sm text-gray-400">
                            {track.artists.map((artist) => artist.name).join(', ')}
                        </p>
                        <p className="text-xs text-gray-500">{track.album.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlaylistDetail;
