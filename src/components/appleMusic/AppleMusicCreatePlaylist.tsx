// components/appleMusic/AppleMusicCreatePlaylist.tsx
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaSearch } from 'react-icons/fa';
import { motion } from "framer-motion";
import { useAppleMusicTrackSearch } from "../../hooks/useAppleMusicTrackSearch";
import { useAppleMusicPlaylistCreation } from "../../hooks/useAppleMusicPlaylistCreation";
import LoadingSpinner from "../spotify/LoadingSpinner";
import { AppleMusicIcon } from "../../icons/AppleMusicIcon";

const AppleMusicCreatePlaylist = () => {
    const navigate = useNavigate();
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
    } = useAppleMusicPlaylistCreation();

    const {
        searchResults,
        isSearching,
        searchTerm,
        setSearchTerm,
        error: searchError
    } = useAppleMusicTrackSearch();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black text-white">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-red-900/50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
                    >
                        <FaChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold">Create New Playlist</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-red-700/50">
                    {/* Playlist Details */}
                    <div className="flex gap-6 mb-8">
                        <div className="w-48 h-48 bg-gray-800 rounded-lg flex items-center justify-center border border-red-700 overflow-hidden">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Playlist Cover" className="object-cover w-full h-full" />
                            ) : (
                                <div
                                    className="w-16 h-16 text-red-700 cursor-pointer"
                                    onClick={() => document.getElementById('fileInput')?.click()}
                                >
                                    <AppleMusicIcon className="w-16 h-16" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <input
                                type="text"
                                placeholder="Playlist name"
                                value={playlistName}
                                onChange={(e) => setPlaylistName(e.target.value)}
                                className="w-full bg-gray-800/70 border border-red-700 rounded-lg px-4 py-3 text-xl
                                    font-bold placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                            />
                            <textarea
                                placeholder="Add an optional description"
                                value={playlistDescription}
                                onChange={(e) => setPlaylistDescription(e.target.value)}
                                className="w-full bg-gray-800/70 border border-red-700 rounded-lg px-4 py-3 h-24
                                    resize-none placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                            />
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-red-400">Upload Cover Image</span>
                                <input
                                    id="fileInput"
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
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for songs to add to your playlist..."
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-full pl-12 pr-4 py-3
                                    placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                            />
                        </div>

                        {searchError && (
                            <div className="text-red-500 text-center py-4">
                                {searchError}
                            </div>
                        )}

                        {/* Search Results */}
                        {isSearching ? (
                            <div className="flex justify-center py-8">
                                <LoadingSpinner color="#fc3c44" />
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="space-y-2">
                                {searchResults.map((track) => (
                                    <motion.div
                                        key={track.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg
                                            hover:bg-gray-700/50 transition-colors"
                                    >
                                        <img
                                            src={track.attributes.artwork.url.replace('{w}', '60').replace('{h}', '60')}
                                            alt={track.attributes.name}
                                            className="w-12 h-12 rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{track.attributes.name}</p>
                                            <p className="text-sm text-gray-400">{track.attributes.artistName}</p>
                                        </div>
                                        <button
                                            onClick={() => addTrack(track)}
                                            disabled={selectedTracks.some((t) => t.id === track.id)}
                                            className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600
                                                disabled:bg-gray-600 transition-colors"
                                        >
                                            {selectedTracks.some((t) => t.id === track.id) ? 'Added' : 'Add'}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        ) : searchTerm && !isSearching && (
                            <div className="text-center text-gray-400 py-8">
                                No tracks found for "{searchTerm}"
                            </div>
                        )}
                    </div>

                    {/* Selected Tracks */}
                    {selectedTracks.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-red-400 mb-4">
                                Selected Tracks ({selectedTracks.length})
                            </h2>
                            <div className="space-y-2">
                                {selectedTracks.map((track) => (
                                    <motion.div
                                        key={track.id}
                                        className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg"
                                    >
                                        <img
                                            src={track.attributes.artwork.url.replace('{w}', '60').replace('{h}', '60')}
                                            alt={track.attributes.name}
                                            className="w-12 h-12 rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{track.attributes.name}</p>
                                            <p className="text-sm text-gray-400">{track.attributes.artistName}</p>
                                        </div>
                                        <button
                                            onClick={() => removeTrack(track.id)}
                                            className="px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/40
                                                transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Create Button */}
                    <div className="mt-8">
                        <button
                            onClick={createPlaylist}
                            disabled={isSaving || !playlistName || selectedTracks.length === 0}
                            className={`w-full py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105
                                ${isSaving || !playlistName || selectedTracks.length === 0
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg shadow-red-500/20'
                                }`}
                        >
                            {isSaving ? 'Creating Playlist...' : 'Create Playlist'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppleMusicCreatePlaylist;