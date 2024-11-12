import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Track } from '../../interfaces/Track.interface';
import { useSpotifyToken } from '../../hooks/useSpotifyToken';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';
import SearchBar from './SearchBar';
import TrackSearchResults from './TrackSearchResults';
import PlaylistBuilder from './PlaylistBuilder';

const CreatePlaylist = () => {
    const navigate = useNavigate();
    const { token } = useSpotifyToken();
    const [searchResults, setSearchResults] = useState<Track[]>([]);
    const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const [playlistDescription, setPlaylistDescription] = useState('');

    const handleSearch = useCallback(async (query: string) => {
        if (!query.trim() || !token) return;

        setIsSearching(true);
        try {
            const response = await axios.get(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                    query
                )}&type=track&limit=10`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSearchResults(response.data.tracks.items);
        } catch (error) {
            console.error('Error searching tracks:', error);
        } finally {
            setIsSearching(false);
        }
    }, [token]);

    const addTrack = (track: Track) => {
        if (!selectedTracks.find(t => t.id === track.id)) {
            setSelectedTracks(prev => [...prev, track]);
        }
    };

    const removeTrack = (trackId: string) => {
        setSelectedTracks(prev => prev.filter(t => t.id !== trackId));
    };

    const createPlaylist = async () => {
        if (!token || !playlistName || selectedTracks.length === 0) return;

        setIsSaving(true);
        try {
            // Get user ID
            const userResponse = await axios.get('https://api.spotify.com/v1/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userId = userResponse.data.id;

            // Create playlist
            const playlistResponse = await axios.post(
                `https://api.spotify.com/v1/users/${userId}/playlists`,
                {
                    name: playlistName,
                    description: playlistDescription,
                    public: false
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Add tracks to playlist
            await axios.post(
                `https://api.spotify.com/v1/playlists/${playlistResponse.data.id}/tracks`,
                {
                    uris: selectedTracks.map(track => track.uri)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            navigate('/');
        } catch (error) {
            console.error('Error creating playlist:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{
            backgroundColor: '#121212', color: '#ffffff', padding: '20px', fontFamily: 'Arial, sans-serif',
            display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh'
        }}>
            <header style={{
                width: '100%', display: 'flex', alignItems: 'center', marginBottom: '20px'
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'transparent', color: '#1DB954', border: 'none', cursor: 'pointer',
                        fontSize: '16px', marginRight: '20px'
                    }}
                >
                    Back
                </button>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Create New Playlist</h1>
            </header>

            <div style={{
                backgroundColor: '#282828', borderRadius: '8px', padding: '20px', width: '100%',
                maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px'
            }}>
                <div style={{
                    display: 'flex', flexDirection: 'column', gap: '10px'
                }}>
                    <input
                        type="text"
                        placeholder="Playlist name"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        style={{
                            backgroundColor: '#333', color: '#fff', padding: '10px',
                            border: '1px solid #555', borderRadius: '4px', fontSize: '16px'
                        }}
                    />
                    <textarea
                        placeholder="Playlist description (optional)"
                        value={playlistDescription}
                        onChange={(e) => setPlaylistDescription(e.target.value)}
                        style={{
                            backgroundColor: '#333', color: '#fff', padding: '10px',
                            border: '1px solid #555', borderRadius: '4px', fontSize: '16px', resize: 'none'
                        }}
                    />
                </div>

                <div>
                    <SearchBar onSearch={handleSearch} />
                    {isSearching ? (
                        <LoadingSpinner />
                    ) : (
                        <TrackSearchResults
                            tracks={searchResults}
                            onAddTrack={addTrack}
                            selectedTracks={selectedTracks}
                        />
                    )}
                </div>

                <div style={{
                    display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px'
                }}>
                    <PlaylistBuilder
                        tracks={selectedTracks}
                        onRemoveTrack={removeTrack}
                    />
                </div>

                <button
                    onClick={createPlaylist}
                    disabled={isSaving || !playlistName || selectedTracks.length === 0}
                    style={{
                        backgroundColor: isSaving ? '#333' : '#1DB954', color: '#fff', padding: '10px 20px',
                        border: 'none', borderRadius: '4px', cursor: isSaving ? 'not-allowed' : 'pointer',
                        fontSize: '16px', fontWeight: 'bold', width: '100%'
                    }}
                >
                    {isSaving ? 'Creating...' : 'Create Playlist'}
                </button>
            </div>
        </div>
    );
};

export default CreatePlaylist;
