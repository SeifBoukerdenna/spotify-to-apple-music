import { useNavigate } from "react-router-dom";
import { useSpotifyToken } from "../../hooks/useSpotifyToken";
import { useTrackSearch } from "../../hooks/useTrackSearch";
import { usePlaylistCreation } from "../../hooks/usePlaylistCreation";
import { CreatePlaylistHeader } from "../header/CreatePlaylistHeader";
import { PlaylistDetails } from "../playlists/PlaylistDetails";
import { SearchSection } from "../search/SearchSection";
import PlaylistBuilder from "./PlaylistBuilder";

const CreatePlaylist = () => {
    const navigate = useNavigate();
    const { token } = useSpotifyToken();

    const {
        selectedTracks,
        isSaving,
        playlistName,
        playlistDescription,
        imagePreview,
        setPlaylistName,
        setPlaylistDescription,
        handleImageUpload,
        addTrack,
        removeTrack,
        createPlaylist,
    } = usePlaylistCreation(token);

    const { searchResults, isSearching, handleSearch } = useTrackSearch(token);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-1100 text-white">
            <CreatePlaylistHeader onBack={() => navigate(-1)} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-green-700/50">
                    <PlaylistDetails
                        playlistName={playlistName}
                        playlistDescription={playlistDescription}
                        imagePreview={imagePreview}
                        onNameChange={setPlaylistName}
                        onDescriptionChange={setPlaylistDescription}
                        onImageUpload={handleImageUpload}
                    />

                    <SearchSection
                        isSearching={isSearching}
                        onSearch={handleSearch}
                        searchResults={searchResults}
                        selectedTracks={selectedTracks}
                        onAddTrack={addTrack}
                    />

                    {selectedTracks.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-green-400 mb-4">
                                Selected Tracks ({selectedTracks.length})
                            </h2>
                            <PlaylistBuilder tracks={selectedTracks} onRemoveTrack={removeTrack} />
                        </div>
                    )}

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