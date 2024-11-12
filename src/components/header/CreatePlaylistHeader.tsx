// components/header/CreatePlaylistHeader.tsx
import { FaChevronLeft } from 'react-icons/fa';

interface CreatePlaylistHeaderProps {
    onBack: () => void;
}

export const CreatePlaylistHeader = ({ onBack }: CreatePlaylistHeaderProps) => (
    <div className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-green-900/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
            <button
                onClick={onBack}
                className="p-2 hover:bg-green-500/20 rounded-full transition-colors"
            >
                <FaChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Create New Playlist</h1>
        </div>
    </div>
);