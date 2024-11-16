// components/appleMusic/UserPanelSkeleton.tsx
export const UserPanelSkeleton = () => {
    return (
        <div className="flex flex-col items-center text-center animate-pulse">
            {/* Profile Picture Skeleton */}
            <div className="w-24 h-24 rounded-full bg-white/10 mb-6" />

            {/* Name Skeleton */}
            <div className="h-8 w-48 bg-white/10 rounded-lg mb-2" />

            {/* Region Skeleton */}
            <div className="h-6 w-32 bg-white/10 rounded-full mb-4" />

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="w-5 h-5 bg-white/10 rounded-full mx-auto mb-2" />
                        <div className="h-4 w-16 bg-white/10 rounded mx-auto mb-2" />
                        <div className="h-8 w-20 bg-white/10 rounded mx-auto" />
                    </div>
                ))}
            </div>

            {/* Subscription Skeleton */}
            <div className="mt-6 h-12 w-64 bg-white/5 rounded-full" />

            {/* Account Link Skeleton */}
            <div className="mt-4 h-10 w-48 bg-white/5 rounded-full" />
        </div>
    );
};