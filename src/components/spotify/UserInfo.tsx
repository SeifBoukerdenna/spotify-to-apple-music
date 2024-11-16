import { SpotifyUser } from '../../interfaces/SpotifyUser.interface';
import { FaSpotify, FaMusic, FaHeart, FaCompactDisc } from 'react-icons/fa';
import { useSpotifyQuery } from '../../hooks/useSpotifyQuery';
import { useSpotifyToken } from '../../hooks/useSpotifyToken';

interface UserInfoProps {
    user: SpotifyUser;
}

const UserInfo = ({ user }: UserInfoProps) => {
    const { token } = useSpotifyToken();

    const { data: playlistsData } = useSpotifyQuery<{ total: number }>(
        token,
        'https://api.spotify.com/v1/me/playlists?limit=1',
        'userPlaylists',
        !!token
    );

    const { data: savedTracksData } = useSpotifyQuery<{ total: number }>(
        token,
        'https://api.spotify.com/v1/me/tracks?limit=1',
        'userSavedTracks',
        !!token
    );

    return (
        <div className="bg-gradient-to-br from-green-500/10 to-green-700/10 rounded-2xl p-8 max-w-2xl mx-auto my-8 backdrop-blur-lg border border-green-500/20">
            <div className="flex flex-col items-center text-center">
                {/* Profile Avatar/Icon */}
                {user.images && user.images.length > 0 ? (
                    <a
                        href={user.external_urls.spotify}
                        target="_blank"
                        rel="noreferrer"
                        className="w-24 h-24 rounded-full overflow-hidden border-2 border-green-500 mb-6 transform transition-transform duration-300 hover:scale-105"
                    >
                        <img
                            src={user.images[0].url}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </a>
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6">
                        <FaSpotify className="w-12 h-12 text-white" />
                    </div>
                )}

                {/* User Name and Email */}
                <h2 className="text-2xl font-bold text-white mb-2">
                    {user.display_name}
                </h2>
                <p className="text-gray-300 mb-4">
                    {user.email}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-6">
                    <StatsCard
                        icon={<FaMusic className="w-5 h-5" />}
                        title="Playlists"
                        value={playlistsData?.total}
                        isLoading={!playlistsData}
                    />
                    <StatsCard
                        icon={<FaHeart className="w-5 h-5" />}
                        title="Liked"
                        value={savedTracksData?.total}
                        isLoading={!savedTracksData}
                    />
                    <StatsCard
                        icon={<FaCompactDisc className="w-5 h-5" />}
                        title="Following"
                        value={user.followers.total}
                        isLoading={false}
                    />
                </div>

                {/* Subscription Info */}
                <div className="mt-6 py-3 px-6 bg-white/5 rounded-full">
                    <span className="text-green-400 font-medium">
                        Spotify {user.product === 'premium' ? 'Premium' : 'Free'} Active
                    </span>
                </div>

                {/* Profile Link */}
                <a
                    href={user.external_urls.spotify}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 text-green-400 hover:text-green-300 transition-colors font-medium flex items-center gap-2"
                >
                    <FaSpotify className="w-4 h-4" />
                    Visit Spotify Profile
                </a>
            </div>
        </div>
    );
};

interface StatsCardProps {
    icon: React.ReactNode;
    title: string;
    value?: number;
    isLoading: boolean;
}

const StatsCard = ({ icon, title, value, isLoading }: StatsCardProps) => (
    <div className="bg-white/5 rounded-xl p-4 text-center">
        <div className="text-green-400 mb-2 flex justify-center">
            {icon}
        </div>
        <h3 className="text-green-400 font-medium text-sm">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">
            {isLoading ? (
                <span className="inline-block w-12 h-8 bg-white/10 rounded animate-pulse" />
            ) : (
                value?.toLocaleString() || '0'
            )}
        </p>
    </div>
);

export default UserInfo;