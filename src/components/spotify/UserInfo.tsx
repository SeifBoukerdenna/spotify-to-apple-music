import { SpotifyUser } from '../../interfaces/SpotifyUser.interface';

interface UserInfoProps {
    user: SpotifyUser;
}

const UserInfo = ({ user }: UserInfoProps) => (
    <div style={{
        backgroundColor: '#282828',
        borderRadius: '10px',
        padding: '20px',
        maxWidth: '500px',
        margin: '20px auto',
        color: '#FFFFFF',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        fontFamily: 'Arial, sans-serif',
    }}>
        <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#1DB954',
        }}>Welcome, {user.display_name}</h2>

        {user.images && user.images.length > 0 && (
            <img
                src={user.images[0].url}
                alt="Profile"
                style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    marginBottom: '15px',
                    border: '2px solid #1DB954',
                }}
            />
        )}

        <p style={{ margin: '5px 0' }}>
            <strong>Email:</strong> {user.email}
        </p>
        <p style={{ margin: '5px 0' }}>
            <strong>Country:</strong> {user.country}
        </p>
        <p style={{ margin: '5px 0' }}>
            <strong>Followers:</strong> {user.followers.total}
        </p>
        <p style={{ margin: '5px 0' }}>
            <strong>Spotify Profile:</strong>{' '}
            <a
                href={user.external_urls.spotify}
                target="_blank"
                rel="noreferrer"
                style={{
                    color: '#1DB954',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                }}
            >
                {user.external_urls.spotify}
            </a>
        </p>
    </div>
);

export default UserInfo;
