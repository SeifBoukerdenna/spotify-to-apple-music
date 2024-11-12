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
            <a
                href={user.external_urls.spotify}
                target="_blank"
                rel="noreferrer"
                className="block w-24 h-24 mx-auto mb-4 rounded-full border-2 border-green-500 overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                title="Go to Spotify profile"
            >
                <img
                    src={user.images[0].url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
            </a>
        )}

        <p className="my-2">
            {user.email}
        </p>
        <p className="my-2">
            <strong>Country:</strong> {user.country}
        </p>
        <p className="my-2">
            <strong>Followers:</strong> {user.followers.total}
        </p>
        <p className="my-2">
            <a
                href={user.external_urls.spotify}
                target="_blank"
                rel="noreferrer"
                className="text-green-500 font-bold hover:underline"
            >
                Visit Spotify Profile
            </a>
        </p>
    </div>
);

export default UserInfo;
