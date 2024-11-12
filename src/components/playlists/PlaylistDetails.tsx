import { FaMusic } from 'react-icons/fa';

interface PlaylistDetailsProps {
    playlistName: string;
    playlistDescription: string;
    imagePreview: string | null;
    onNameChange: (name: string) => void;
    onDescriptionChange: (description: string) => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PlaylistDetails = ({
    playlistName,
    playlistDescription,
    imagePreview,
    onNameChange,
    onDescriptionChange,
    onImageUpload,
}: PlaylistDetailsProps) => (
    <div className="flex gap-6 mb-8">
        <div className="w-48 h-48 bg-gray-800 rounded-lg flex items-center justify-center border border-green-700 overflow-hidden">
            {imagePreview ? (
                <img src={imagePreview} alt="Playlist Cover" className="object-cover w-full h-full" />
            ) : (
                <FaMusic
                    className="w-16 h-16 text-green-700 cursor-pointer"
                    onClick={() => document.getElementById('fileInput')?.click()}
                />
            )}
        </div>
        <div className="flex-1 space-y-4">
            <input
                type="text"
                placeholder="Playlist name"
                value={playlistName}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full bg-gray-800/70 border border-green-700 rounded-lg px-4 py-3 text-xl font-bold placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
            />
            <textarea
                placeholder="Add an optional description"
                value={playlistDescription}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="w-full bg-gray-800/70 border border-green-700 rounded-lg px-4 py-3 h-24 resize-none placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
            />
            <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-green-400">Upload Cover Image</span>
                <input
                    id="fileInput"
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={onImageUpload}
                    className="hidden"
                />
            </label>
        </div>
    </div>
);