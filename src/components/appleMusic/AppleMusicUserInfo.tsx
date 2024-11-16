// components/appleMusic/AppleMusicUserInfo.tsx
import { motion } from 'framer-motion';
import type { AppleMusicUser } from '../../hooks/useAppleMusicUser';
import { AppleMusicIcon } from '../../icons/AppleMusicIcon';

interface AppleMusicUserInfoProps {
    user: AppleMusicUser;
}

export const AppleMusicUserInfo = ({ user }: AppleMusicUserInfoProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl p-8
                 max-w-2xl mx-auto my-8 backdrop-blur-lg border border-red-500/20"
        >
            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-pink-600
                      flex items-center justify-center mb-6">
                    <AppleMusicIcon className="w-12 h-12 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                    Apple Music Library
                </h2>

                <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-6">
                    <StatsCard
                        title="Playlists"
                        value={user.stats.playlists}
                        icon="🎵"
                    />
                    <StatsCard
                        title="Songs"
                        value={user.stats.songs}
                        icon="🎼"
                    />
                    <StatsCard
                        title="Albums"
                        value={user.stats.albums}
                        icon="💿"
                    />
                </div>

                <div className="mt-8 space-y-4">
                    <div className="bg-white/5 rounded-full py-2 px-6">
                        <span className="text-red-400">
                            {user.subscription.type} Subscription
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

interface StatsCardProps {
    title: string;
    value: number;
    icon: string;
}

const StatsCard = ({ title, value, icon }: StatsCardProps) => (
    <div className="bg-white/5 rounded-xl p-4 text-center backdrop-blur-sm">
        <div className="text-2xl mb-2">{icon}</div>
        <h3 className="text-red-400 font-medium text-sm">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">
            {value.toLocaleString()}
        </p>
    </div>
);