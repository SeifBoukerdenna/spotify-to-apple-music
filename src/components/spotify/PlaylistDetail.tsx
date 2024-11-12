// PlaylistDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useSpotifyToken } from '../../hooks/useSpotifyToken';
import { usePlaylistDetails } from '../../hooks/usePlaylistDetails';
import LoadingSpinner from './LoadingSpinner';
import { PlaylistHeader } from '../header/PlaylistHeader';
import { TrackGrid } from '../tracks/TracksGrid';

const PlaylistDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { token } = useSpotifyToken();
    const navigate = useNavigate();

    const { tracks, playlistInfo, isLoading, error } = usePlaylistDetails(token, id);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black text-white flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !playlistInfo) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black text-white p-8 text-center">
                <p className="text-red-500">{error || 'Playlist not found'}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 bg-green-500 text-white rounded-full px-5 py-2 hover:bg-green-400"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black text-white p-8">
            <PlaylistHeader playlist={playlistInfo} onBack={() => navigate(-1)} />
            <TrackGrid tracks={tracks} />
        </div>
    );
};

export default PlaylistDetail;