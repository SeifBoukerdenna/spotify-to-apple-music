import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { SavedTrackItem } from '../interfaces/SavedTrack.interface';
import { Track } from '../interfaces/Track.interface';
import LoadingSpinner from './LoadingSpinner';
import SortingFilteringControls from './SortingFilteringControls';
import TrackItem from './TrackItem';
import { useSpotifyToken } from '../hooks/useSpotifyToken';
import { useSpotifyInfiniteQuery } from '../hooks/useSpotifyInfiniteQuery';
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

    // Download metadata for a single track
    const handleDownload = (track: Track) => {
        const trackData = {
            song: track.name,
            artist: track.artists.map((a) => a.name).join(', '),
            album: track.album.name,
            year: track.album.release_date ? track.album.release_date.slice(0, 4) : '',
        };

        const jsonData = JSON.stringify(trackData, null, 2);
        const blob = new Blob([jsonData], {
            type: 'application/json;charset=utf-8',
        });
        FileSaver.saveAs(blob, `${track.name}-metadata.json`);
    };

    return (
        <>
            <header>
                <h1>Liked Songs</h1>
                <button onClick={() => navigate(-1)}>Back</button>
            </header>
            <div className="container">
                {isLoading && <LoadingSpinner />}
                {error && <p>Error fetching liked songs.</p>}
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

                        <div className="info-grid">
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
                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                >
                                    {isFetchingNextPage ? (
                                        <LoadingSpinner size={20} />
                                    ) : (
                                        'Load More'
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default LikedSongsDetail;
