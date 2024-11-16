// components/appleMusic/AppleMusicPlaylistDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMusicKit } from '../../hooks/useMusicKit';
import { useAppleMusicDownload } from '../../hooks/useAppleMusicDownload';
import LoadingSpinner from '../spotify/LoadingSpinner';
import { PlaylistHeader } from '../header/PlaylistHeader';
import { PlaylistTracksGrid } from '../tracks/PlaylistTracksGrid';
import { Track } from '../../interfaces/Track.interface';
import { AppleMusicTrack } from '../../hooks/useAppleMusicLibrary';

interface AppleMusicTracksResponse {
    data: AppleMusicTrack[];
    meta: {
        total: number;
    };
}

interface AppleMusicPlaylistResponse {
    data: Array<MusicKit.Resource<MusicKit.PlaylistAttributes>>;
}

const AppleMusicPlaylistDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { musicKitInstance, isAuthorized } = useMusicKit();
    const { handleTrackDownload, handlePlaylistDownload } = useAppleMusicDownload();
    const [playlist, setPlaylist] = useState<MusicKit.Resource<MusicKit.PlaylistAttributes> | null>(null);
    const [tracks, setTracks] = useState<AppleMusicTrack[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            if (!musicKitInstance || !isAuthorized || !id) return;

            try {
                setIsLoading(true);

                const playlistResponse = await fetch(
                    `https://api.music.apple.com/v1/me/library/playlists/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${musicKitInstance.developerToken}`,
                            'Music-User-Token': musicKitInstance.musicUserToken,
                        },
                    }
                );

                if (!playlistResponse.ok) {
                    throw new Error('Failed to fetch playlist details');
                }

                const playlistData: AppleMusicPlaylistResponse = await playlistResponse.json();
                const playlistResource = playlistData.data[0];
                setPlaylist(playlistResource);

                const tracksResponse = await fetch(
                    `https://api.music.apple.com/v1/me/library/playlists/${id}/tracks`,
                    {
                        headers: {
                            Authorization: `Bearer ${musicKitInstance.developerToken}`,
                            'Music-User-Token': musicKitInstance.musicUserToken,
                        },
                    }
                );

                if (!tracksResponse.ok) {
                    throw new Error('Failed to fetch playlist tracks');
                }

                const tracksData: AppleMusicTracksResponse = await tracksResponse.json();
                setTracks(tracksData.data);
            } catch (err) {
                console.error('Error fetching playlist details:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylistDetails();
    }, [musicKitInstance, isAuthorized, id]);

    const handleDownloadTrack = (track: Track) => {
        const originalTrack = tracks.find(t => t.id === track.id);
        if (originalTrack && musicKitInstance) {
            handleTrackDownload(originalTrack);
        }
    };

    const handleDownloadPlaylist = () => {
        if (playlist && musicKitInstance) {
            handlePlaylistDownload(playlist, musicKitInstance);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black text-white flex items-center justify-center">
                <LoadingSpinner color="#fc3c44" />
            </div>
        );
    }

    if (error || !playlist) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black text-white p-8 text-center">
                <p className="text-red-500">{error || 'Playlist not found'}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full px-5 py-2 hover:from-red-600 hover:to-pink-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Convert Apple Music tracks to the common Track interface format
    const formattedTracks: Track[] = tracks.map(track => ({
        id: track.id,
        name: track.attributes.name,
        artists: [{ id: '1', name: track.attributes.artistName, external_urls: { spotify: '' } }],
        album: {
            id: '1',
            name: track.attributes.albumName,
            images: [{ url: track.attributes.artwork.url.replace('{w}', '300').replace('{h}', '300') }],
            release_date: track.attributes.releaseDate || '',
            release_date_precision: 'year',
            total_tracks: 0,
            type: 'album',
            external_urls: { spotify: '' },
            artists: [{ id: '1', name: track.attributes.artistName, external_urls: { spotify: '' } }]
        },
        external_urls: { spotify: '' },
        uri: ''
    }));

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black text-white p-8">
            <PlaylistHeader
                playlist={{
                    id: playlist.id,
                    name: playlist.attributes.name,
                    description: playlist.attributes.description?.standard || '',
                    images: playlist.attributes.artwork ?
                        [{ url: playlist.attributes.artwork.url.replace('{w}', '300').replace('{h}', '300') }] :
                        [],
                    tracks: { total: playlist.attributes.trackCount },
                    external_urls: { spotify: '' }
                }}
                onBack={() => navigate(-1)}
                isAppleMusic={true}
                onDownload={handleDownloadPlaylist}
            />
            <PlaylistTracksGrid
                tracks={formattedTracks}
                isAppleMusic={true}
                onTrackDownload={handleDownloadTrack}
            />
        </div>
    );
};

export default AppleMusicPlaylistDetail;