import { SpotifyUser } from '../interfaces/SpotifyUser.interface';

interface UserInfoProps {
    user: SpotifyUser;
}

const UserInfo = ({ user }: UserInfoProps) => (
    <div className="user-info">
        <h2>Welcome, {user.display_name}</h2>
        {user.images && user.images.length > 0 && (
            <img src={user.images[0].url} alt="Profile" className="profile-image" />
        )}
        <p>
            <strong>Email:</strong> {user.email}
        </p>
        <p>
            <strong>Country:</strong> {user.country}
        </p>
        <p>
            <strong>Followers:</strong> {user.followers.total}
        </p>
        <p>
            <strong>Spotify Profile:</strong>{' '}
            <a href={user.external_urls.spotify} target="_blank" rel="noreferrer">
                {user.external_urls.spotify}
            </a>
        </p>
    </div>
);

export default UserInfo;
