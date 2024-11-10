import { useState, useEffect } from "react";
import { SPOTIFY_CLIENT_ID, REDIRECT_URI } from "../config";

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPE =
  "user-read-private user-read-email user-top-read user-read-recently-played user-library-read playlist-read-private playlist-read-collaborative";

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
