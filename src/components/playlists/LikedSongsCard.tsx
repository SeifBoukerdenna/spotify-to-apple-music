// components/playlists/LikedSongsCard.tsx
interface LikedSongsCardProps {
    userImage: string;
    onNavigate: () => void;
    onDownload: () => void;
}

export const LikedSongsCard = ({ userImage, onNavigate, onDownload }: LikedSongsCardProps) => (
    <div
        className="w-full max-w-xs rounded-lg p-4 flex flex-col items-center text-center cursor-pointer bg-cover bg-center relative overflow-hidden transition-transform transform hover:scale-105"
        style={{ backgroundImage: `url(${userImage})` }}
        onClick={onNavigate}
    >
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md rounded-lg" />
        <div className="relative z-10 flex-1 flex items-center justify-center h-24">
            <p className="text-xl font-bold">Liked Songs</p>
        </div>
        <button
            onClick={(e) => { e.stopPropagation(); onDownload(); }}
            className="relative z-10 bg-green-500 text-white rounded-lg px-4 py-2 cursor-pointer mt-3 w-full"
        >
            Download Liked Songs Metadata
        </button>
    </div>
);
