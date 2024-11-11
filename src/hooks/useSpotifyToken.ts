import { useState, useEffect } from "react";
import { SPOTIFY_CLIENT_ID, REDIRECT_URI } from "../config";

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPE =
  "user-read-private user-read-email user-top-read user-read-recently-played user-library-read playlist-read-private playlist-read-collaborative";

/**
 * Custom React hook for managing Spotify OAuth authentication.
 *
 * This hook manages the Spotify access token, handling login and logout actions.
 * It checks the URL for an access token on load and stores it in local storage
 * if available, enabling automatic login persistence across sessions.
 *
 * @returns {Object} An object containing the Spotify access token, any authorization error, and login/logout handlers.
 * @property {string | null} token - The current Spotify access token, or null if not authenticated.
 * @property {string | null} authError - Any error encountered during authentication, or null if none.
 * @property {function} handleLogin - Initiates the Spotify login flow by redirecting to the Spotify authorization endpoint.
 * @property {function} handleLogout - Logs the user out by clearing the access token and reloading the page.
 *
 * @example
 * const { token, authError, handleLogin, handleLogout } = useSpotifyToken();
 *
 * if (!token) {
 *   return <button onClick={handleLogin}>Login to Spotify</button>;
 * }
 *
 * return (
 *   <div>
 *     <p>Authenticated with Spotify!</p>
 *     <button onClick={handleLogout}>Logout</button>
 *     {authError && <p>Error: {authError}</p>}
 *   </div>
 * );
 */
export const useSpotifyToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    let accessToken = window.localStorage.getItem("spotify_access_token");

    if (!accessToken && hash) {
      accessToken = new URLSearchParams(hash.substring(1)).get("access_token");
      window.location.hash = "";
      if (accessToken) {
        window.localStorage.setItem("spotify_access_token", accessToken);
        setToken(accessToken);
      }
    } else if (accessToken) {
      setToken(accessToken);
    }

    if (search) {
      const error = new URLSearchParams(search).get("error");
      if (error) {
        setAuthError(error);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    }
  }, []);

  const handleLogin = () => {
    const authUrl = `${AUTH_ENDPOINT}?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}`;
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    setToken(null);
    window.localStorage.removeItem("spotify_access_token");
    window.location.reload();
  };

  return { token, authError, handleLogin, handleLogout };
};
