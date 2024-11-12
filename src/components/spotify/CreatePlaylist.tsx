import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Track } from '../../interfaces/Track.interface';
import { useSpotifyToken } from '../../hooks/useSpotifyToken';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';
import SearchBar from './SearchBar';
import TrackSearchResults from './TrackSearchResults';
import PlaylistBuilder from './PlaylistBuilder';
import { FaMusic, FaSearch, FaChevronLeft } from 'react-icons/fa';

const CreatePlaylist = () => {
    const navigate = useNavigate();
    const { token } = useSpotifyToken();
    const [searchResults, setSearchResults] = useState<Track[]>([]);
    const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const [playlistDescription, setPlaylistDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleSearch = useCallback(async (query: string) => {
        if (!query.trim() || !token) return;

        setIsSearching(true);
        try {
            const response = await axios.get(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
                { headers: { Authorization: `Bearer ${token}` } }
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const createPlaylist = async () => {
        if (!token || !playlistName || selectedTracks.length === 0) return;

        setIsSaving(true);
        try {
            const userResponse = await axios.get('https://api.spotify.com/v1/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userId = userResponse.data.id;

            const playlistResponse = await axios.post(
                `https://api.spotify.com/v1/users/${userId}/playlists`,
                { name: playlistName, description: playlistDescription, public: false },
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );

            const playlistId = playlistResponse.data.id;

            // Upload image if available
            if (imageFile) {
                const imageData = await imageFile.arrayBuffer();
                await axios.put(
                    `https://api.spotify.com/v1/playlists/${playlistId}/images`,
                    imageData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'image/jpeg',
                        },
                    }
                );
            }

            await axios.post(
                `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                { uris: selectedTracks.map(track => track.uri) },
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );

            navigate('/');
        } catch (error) {
            console.error('Error creating playlist:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-green-900/50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-green-500/20 rounded-full transition-colors"
                    >
                        <FaChevronLeft className="w-6 h-6 text-green-400" />
                    </button>
                    <h1 className="text-2xl font-bold text-green-400">Create New Playlist</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-green-700/50">
                    {/* Playlist Details */}
                    <div className="flex gap-6 mb-8">
                        <div className="w-48 h-48 bg-gray-800 rounded-lg flex items-center justify-center border border-green-700 overflow-hidden">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Playlist Cover" className="object-cover w-full h-full" />
                            ) : (
                                <FaMusic className="w-16 h-16 text-green-700" />
                            )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <input
                                type="text"
                                placeholder="Playlist name"
                                value={playlistName}
                                onChange={(e) => setPlaylistName(e.target.value)}
                                className="w-full bg-gray-800/70 border border-green-700 rounded-lg px-4 py-3 text-xl font-bold placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                            />
                            <textarea
                                placeholder="Add an optional description"
                                value={playlistDescription}
                                onChange={(e) => setPlaylistDescription(e.target.value)}
                                className="w-full bg-gray-800/70 border border-green-700 rounded-lg px-4 py-3 h-24 resize-none placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                            />
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-green-400">Upload Cover Image</span>
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="space-y-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <FaSearch className="w-5 h-5 text-green-500" />
                            </div>
                            <SearchBar onSearch={handleSearch} />
                        </div>

                        {isSearching ? (
                            <div className="flex justify-center py-8">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <TrackSearchResults
                                    tracks={searchResults}
                                    onAddTrack={addTrack}
                                    selectedTracks={selectedTracks}
                                />
                            </div>
                        )}
                    </div>

                    {/* Selected Tracks */}
                    {selectedTracks.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-green-400 mb-4">Selected Tracks ({selectedTracks.length})</h2>
                            <PlaylistBuilder tracks={selectedTracks} onRemoveTrack={removeTrack} />
                        </div>
                    )}

                    {/* Create Button */}
                    <div className="mt-8">
                        <button
                            onClick={createPlaylist}
                            disabled={isSaving || !playlistName || selectedTracks.length === 0}
                            className={`w-full py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${isSaving || !playlistName || selectedTracks.length === 0
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-300 text-white shadow-lg shadow-green-500/20'
                                }`}
                        >
                            {isSaving ? 'Creating...' : 'Create Playlist'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePlaylist;
