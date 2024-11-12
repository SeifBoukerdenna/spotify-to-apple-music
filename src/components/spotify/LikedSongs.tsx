import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { SavedTrackItem } from '../../interfaces/SavedTrack.interface';
import { Track } from '../../interfaces/Track.interface';
import LoadingSpinner from './LoadingSpinner';
import SortingFilteringControls from './SortingFilteringControls';
import TrackItem from './TrackItem';
import { useSpotifyToken } from '../../hooks/useSpotifyToken';
import { useSpotifyInfiniteQuery } from '../../hooks/useSpotifyInfiniteQuery';
import FileSaver from 'file-saver';

const LikedSongsDetail = () => {
    const navigate = useNavigate();
    const { token } = useSpotifyToken();

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [sortOption, setSortOption] = useState<'name' | 'artist' | 'album' | 'none'>('none');

    const processSavedTracks = (items: SavedTrackItem[]) => items.map((item) => item.track);

    const {
        items: likedSongs,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useSpotifyInfiniteQuery<SavedTrackItem, Track>(
        token,
        'https://api.spotify.com/v1/me/tracks',
        'likedSongs',
        20,
        !!token,
        0,
        processSavedTracks
    );

    useEffect(() => {
        if (!isLoading && !isFetchingNextPage && hasNextPage && debouncedSearchTerm) {
            const filteredSongs = likedSongs.filter((track) =>
                track.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                track.artists.some((artist) =>
                    artist.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                ) ||
                track.album.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );

            if (filteredSongs.length === 0) {
                fetchNextPage();
            }
        }
    }, [
        debouncedSearchTerm,
        likedSongs,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    ]);

    const handleDownload = (track: Track) => {
        const blob = new Blob([JSON.stringify(track, null, 2)], {
            type: 'application/json;charset=utf-8',
        });
        FileSaver.saveAs(blob, `${track.name}-metadata.json`);
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-12 font-sans">
            <header className="text-center pb-5 border-b border-gray-700">
                <h1 className="text-2xl font-bold">Liked Songs</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 bg-green-500 text-white rounded-full px-6 py-2 cursor-pointer hover:bg-green-400 transition-colors"
                >
                    Back
                </button>
            </header>

            {isLoading && <LoadingSpinner />}
            {error && <p className="text-center text-red-500 mt-4">Error fetching liked songs.</p>}

            {likedSongs && (
                <>
                    <SortingFilteringControls
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        sortOption={sortOption}
                        setSortOption={setSortOption}
                        sortOptions={[
                            { value: 'none', label: 'None' },
                            { value: 'name', label: 'Name' },
                            { value: 'artist', label: 'Artist' },
                            { value: 'album', label: 'Album' },
                        ]}
                        placeholder="Search songs..."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                        {likedSongs
                            .filter((track) =>
                                track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                track.artists.some((artist) =>
                                    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
                                ) ||
                                track.album.name.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .sort((a, b) => {
                                if (sortOption === 'name') {
                                    return a.name.localeCompare(b.name);
                                } else if (sortOption === 'artist') {
                                    return a.artists[0].name.localeCompare(b.artists[0].name);
                                } else if (sortOption === 'album') {
                                    return a.album.name.localeCompare(b.album.name);
                                } else {
                                    return 0;
                                }
                            })
                            .map((track) => (
                                <TrackItem key={track.id} track={track} onDownload={handleDownload} />
                            ))}
                    </div>

                    {hasNextPage && (
                        <div className="text-center mt-6">
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className={`bg-green-500 text-white rounded-lg px-6 py-2 font-medium transition-colors ${isFetchingNextPage ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-400'}`}
                            >
                                {isFetchingNextPage ? <LoadingSpinner size={20} /> : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default LikedSongsDetail;
