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
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black text-white p-8">
            <header className="text-center pb-6 border-b border-gray-700 mb-10">
                <h1 className="text-3xl font-extrabold">{playlistInfo?.name}</h1>
                <p className="text-gray-400 mt-2 max-w-2xl mx-auto">{playlistInfo?.description}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-6 bg-green-500 text-white rounded-full px-5 py-2 hover:bg-green-400 transition-transform transform hover:scale-105"
                >
                    Back
                </button>
            </header>

            {/* Main Content Container */}
            <div className="max-w-screen-xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {tracks.map((track) => (
                        <div
                            key={track.id}
                            className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transform transition-all duration-200 hover:scale-105 relative"
                        >
                            {track.album.images.length > 0 && (
                                <img
                                    src={track.album.images[0].url}
                                    alt={track.album.name}
                                    className="w-full h-40 object-cover opacity-90"
                                />
                            )}
                            <div className="p-4 bg-gradient-to-t from-black via-gray-800 to-transparent absolute inset-0 flex flex-col justify-end text-white">
                                <p className="font-bold text-lg truncate">{track.name}</p>
                                <p className="text-sm text-gray-300 truncate">
                                    {track.artists.map((artist) => artist.name).join(', ')}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{track.album.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlaylistDetail;
