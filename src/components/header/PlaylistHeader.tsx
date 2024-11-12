import { Playlist } from '../../interfaces/Playlist.interface';

interface PlaylistHeaderProps {
    playlist: Playlist;
    onBack: () => void;
}

export const PlaylistHeader = ({ playlist, onBack }: PlaylistHeaderProps) => (
    <header className="text-center pb-6 border-b border-gray-700 mb-10">
        <h1 className="text-3xl font-extrabold">{playlist.name}</h1>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">{playlist.description}</p>
        <button
            onClick={onBack}
            className="mt-6 bg-green-500 text-white rounded-full px-5 py-2 hover:bg-green-400 transition-transform transform hover:scale-105"
        >
            Back
        </button>
    </header>
);