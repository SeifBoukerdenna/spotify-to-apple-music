import { SpotifyUser } from '../../interfaces/SpotifyUser.interface';

interface UserInfoProps {
    user: SpotifyUser;
}

const UserInfo = ({ user }: UserInfoProps) => (
    <div className="bg-gray-800 rounded-lg p-5 max-w-2xl mx-auto my-5 text-white text-center shadow-md">
        <h2 className="text-2xl font-bold mb-3 text-green-500">
            Welcome, {user.display_name}
        </h2>

        {user.images && user.images.length > 0 && (
            <img
                src={user.images[0].url}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-green-500"
            />
        )}

        <p className="my-2">
            <strong>Email:</strong> {user.email}
        </p>
        <p className="my-2">
            <strong>Country:</strong> {user.country}
        </p>
        <p className="my-2">
            <strong>Followers:</strong> {user.followers.total}
        </p>
        <p className="my-2">
            <strong>Spotify Profile:</strong>{' '}
            <a
                href={user.external_urls.spotify}
                target="_blank"
                rel="noreferrer"
                className="text-green-500 font-bold hover:underline"
            >
                {user.external_urls.spotify}
            </a>
        </p>
    </div>
);

export default UserInfo;
