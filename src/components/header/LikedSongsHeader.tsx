// components/header/LikedSongsHeader.tsx
interface LikedSongsHeaderProps {
    onBack: () => void;
}

export const LikedSongsHeader = ({ onBack }: LikedSongsHeaderProps) => (
    <header className="text-center pb-5 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Liked Songs</h1>
        <button
            onClick={onBack}
            className="mt-4 bg-green-500 text-white rounded-full px-6 py-2 cursor-pointer hover:bg-green-400 transition-colors"
        >
            Back
        </button>
    </header>
);