import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { SavedTrackItem } from '../interfaces/SavedTrack.interface';
import LoadingSpinner from './LoadingSpinner';
import SortingFilteringControls from './SortingFilteringControls';
import TrackItem from './TrackItem';


const LikedSongsDetail = () => {
    const navigate = useNavigate();

    const token = window.localStorage.getItem('spotify_access_token');

    // State for sorting and filtering
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [sortOption, setSortOption] = useState<'name' | 'artist' | 'album' | 'none'>('none');

    // Fetch liked songs using React Query's useInfiniteQuery
    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<{
        items: SavedTrackItem[];
        next: string | null;
    }, Error>({
        queryKey: ['likedSongs'],
        queryFn: async ({ pageParam = 0 }) => {
            const limit = 20;
            const offset = pageParam;
            const response = await axios.get<{
                items: SavedTrackItem[];
                total: number;
                next: string | null;
            }>(
                `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return {
                items: response.data.items,
                next: response.data.next,
            };
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.next) {
                const url = new URL(lastPage.next);
                const offsetParam = url.searchParams.get('offset');
                return offsetParam ? parseInt(offsetParam, 10) : undefined;
            } else {
                return undefined;
            }
        },
        enabled: !!token,
        initialPageParam: 0,
    });

    // Combine pages of data
    const likedSongs = React.useMemo(() => {
        return data?.pages.flatMap((page) =>
            page.items.map((item) => item.track)
        ) || [];
    }, [data]);

    // Effect to load more data when search yields no results
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
                // Fetch more pages if available
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
                        {/* Sorting and Filtering Controls */}
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
                                    <TrackItem key={track.id} track={track} />
                                ))}
                        </div>

                        {/* Load More Button */}
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
