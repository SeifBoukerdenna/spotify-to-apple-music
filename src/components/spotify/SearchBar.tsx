// components/spotify/SearchBar.tsx
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
}

export const SearchBar = ({ searchTerm, onSearchChange, placeholder = "Search for songs..." }: SearchBarProps) => {
    return (
        <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-full
                 pl-12 pr-4 py-3 placeholder-gray-500 focus:outline-none
                 focus:border-green-500 transition-colors"
            />
        </div>
    );
};