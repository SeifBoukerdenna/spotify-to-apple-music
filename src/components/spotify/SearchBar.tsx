// SearchBar.tsx
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (debouncedSearchTerm) {
            onSearch(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm, onSearch]);

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search for songs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-full pl-12 pr-4 py-3 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
            />
        </div>
    );
};

export default SearchBar;