// components/search/SearchSection.tsx
import { Track } from '../../interfaces/Track.interface';
import LoadingSpinner from '../spotify/LoadingSpinner';
import { SearchBar } from '../spotify/SearchBar';
import TrackSearchResults from '../spotify/TrackSearchResults';

interface SearchSectionProps {
    isSearching: boolean;
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    searchResults: Track[];
    selectedTracks: Track[];
    onAddTrack: (track: Track) => void;
    error: string | null;
}

export const SearchSection = ({
    isSearching,
    searchTerm,
    onSearchTermChange,
    searchResults,
    selectedTracks,
    onAddTrack,
    error,
}: SearchSectionProps) => (
    <div className="space-y-6">
        <SearchBar
            searchTerm={searchTerm}
            onSearchChange={onSearchTermChange}
            placeholder="Search for songs to add to your playlist..."
        />

        {error && (
            <div className="text-red-500 text-center py-4">
                {error}
            </div>
        )}

        {isSearching ? (
            <div className="flex justify-center py-8">
                <LoadingSpinner />
            </div>
        ) : searchResults.length > 0 ? (
            <div className="space-y-4">
                <TrackSearchResults
                    tracks={searchResults}
                    onAddTrack={onAddTrack}
                    selectedTracks={selectedTracks}
                />
            </div>
        ) : searchTerm && !isSearching && (
            <div className="text-center text-gray-400 py-8">
                No tracks found for "{searchTerm}"
            </div>
        )}
    </div>
);