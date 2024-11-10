import { useState, useEffect } from 'react';
import './AppleMusicStyles.css';
import { useMusicKit } from '../../hooks/useMusicKit';

const AppleMusicHome = () => {
    const { musicKitInstance, isAuthorized, handleAuthorize, handleUnauthorize } = useMusicKit();
    const [playlists, setPlaylists] = useState<MusicKit.Resource<MusicKit.PlaylistAttributes>[]>([]);

    useEffect(() => {
        const fetchUserPlaylists = async () => {
            if (isAuthorized && musicKitInstance) {
                try {
                    const response = await musicKitInstance.api.library.playlists();
                    setPlaylists(response);
                } catch (error) {
                    console.error('Error fetching playlists:', error);
                }
            }
        };

        fetchUserPlaylists();
    }, [isAuthorized, musicKitInstance]);

    return (
        <div className="apple-music-home">
            <header className="apple-music-header">
                <h1>Apple Music</h1>
                <nav className="apple-music-nav">
                    <ul>
                        <li>Listen Now</li>
                        <li>Browse</li>
                        <li>Radio</li>
                        <li>Library</li>
                        <li>Search</li>
                    </ul>
                </nav>
            </header>
            <div className="apple-music-content">
                {!isAuthorized ? (
                    <button onClick={handleAuthorize}>Connect to Apple Music</button>
                ) : (
                    <>
                        <button onClick={handleUnauthorize}>Disconnect</button>
                        <h2>Your Playlists</h2>
                        {playlists.length === 0 ? (
                            <p>No playlists found.</p>
                        ) : (
                            <div className="playlist-grid">
                                {playlists.map((playlist) => (
                                    <div key={playlist.id} className="playlist-item">
                                        {playlist.attributes.artwork && (
                                            <img
                                                src={playlist.attributes.artwork.url.replace('{w}x{h}', '200x200')}
                                                alt={playlist.attributes.name}
                                            />
                                        )}
                                        <p>{playlist.attributes.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AppleMusicHome;
