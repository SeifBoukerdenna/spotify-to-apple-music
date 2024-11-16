// components/appleMusic/AppleMusicUserInfo.tsx
import { FaApple, FaMusic, FaHeart, FaCompactDisc, FaExternalLinkAlt } from 'react-icons/fa';
import { AppleMusicIcon } from '../../icons/AppleMusicIcon';
import type { AppleMusicUser } from '../../hooks/useAppleMusicUser';

interface AppleMusicUserInfoProps {
    user: AppleMusicUser;
}

export const AppleMusicUserInfo = ({ user }: AppleMusicUserInfoProps) => {
    return (
        <div className="flex flex-col items-center text-center">
            {/* Profile Picture/Icon */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 mb-6 shadow-lg">
                {user.imageUrl ? (
                    <img
                        src={user.imageUrl}
                        alt={user.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-500 to-rose-600
            flex items-center justify-center">
                        <AppleMusicIcon className="w-12 h-12 text-white" />
                    </div>
                )}
            </div>

            {/* User Info */}
            <h2 className="text-2xl font-bold text-white mb-2">
                {user.name}
            </h2>
            <div className="px-3 py-1.5 bg-white/10 rounded-full text-sm text-gray-300 mb-4">
                Region: {user.storefront.toUpperCase()}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-6">
                <StatsCard
                    icon={<FaMusic className="w-5 h-5" />}
                    title="Songs"
                    value={user.stats.songs}
                />
                <StatsCard
                    icon={<FaHeart className="w-5 h-5" />}
                    title="Playlists"
                    value={user.stats.playlists}
                />
                <StatsCard
                    icon={<FaCompactDisc className="w-5 h-5" />}
                    title="Albums"
                    value={user.stats.albums}
                />
            </div>

            {/* Subscription Info */}
            <div className="mt-6 py-3 px-6 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-full
        border border-white/10 shadow-lg backdrop-blur-sm">
                <span className="text-white font-medium">
                    {user.subscription.type} Subscription Active
                </span>
            </div>

            {/* Account Link */}
            <a
                href={`https://music.apple.com/${user.storefront}/account`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 text-white hover:text-pink-200 transition-colors font-medium
          flex items-center gap-2 group bg-white/10 px-4 py-2 rounded-full
          hover:bg-white/20"
            >
                <FaApple className="w-4 h-4" />
                <span>View Apple Music Account</span>
                <FaExternalLinkAlt className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </a>
        </div>
    );
};

interface StatsCardProps {
    icon: React.ReactNode;
    title: string;
    value: number;
}

const StatsCard = ({ icon, title, value }: StatsCardProps) => (
    <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-4 text-center
    border border-white/10 shadow-lg backdrop-blur-sm">
        <div className="text-pink-300 mb-2 flex justify-center">
            {icon}
        </div>
        <h3 className="text-gray-300 font-medium text-sm">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">
            {value.toLocaleString()}
        </p>
    </div>
);