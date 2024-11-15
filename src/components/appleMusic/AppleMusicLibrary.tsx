// components/appleMusic/AppleMusicLibrary.tsx
import { useAppleMusicLibrary } from '../../hooks/useAppleMusicLibrary';
import { AppleMusicPlaylistCard } from './AppleMusicPlaylistCard';
import LoadingSpinner from '../spotify/LoadingSpinner';

export const AppleMusicLibrary = () => {
    const { playlists, isLoading, error } = useAppleMusicLibrary();

    if (isLoading) return <LoadingSpinner color="#fc3c44" />;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6">Your Library</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {playlists.map((playlist) => (
                    <AppleMusicPlaylistCard key={playlist.id} playlist={playlist} />
                ))}
            </div>
        </div>
    );
};