// components/search/SearchSection.tsx
import { FaSearch } from 'react-icons/fa';
import { Track } from '../../interfaces/Track.interface';
import LoadingSpinner from '../spotify/LoadingSpinner';
import SearchBar from '../spotify/SearchBar';
import TrackSearchResults from '../spotify/TrackSearchResults';

interface SearchSectionProps {
    isSearching: boolean;
    onSearch: (query: string) => void;
    searchResults: Track[];
    selectedTracks: Track[];
    onAddTrack: (track: Track) => void;
}

export const SearchSection = ({
    isSearching,
    onSearch,
    searchResults,
    selectedTracks,
    onAddTrack,
}: SearchSectionProps) => (
    <div className="space-y-6">
        <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <FaSearch className="w-5 h-5 text-green-500" />
            </div>
            <SearchBar onSearch={onSearch} />
        </div>

        {isSearching ? (
            <div className="flex justify-center py-8">
                <LoadingSpinner />
            </div>
        ) : (
            <div className="space-y-4">
                <TrackSearchResults
                    tracks={searchResults}
                    onAddTrack={onAddTrack}
                    selectedTracks={selectedTracks}
                />
            </div>
        )}
    </div>
);
