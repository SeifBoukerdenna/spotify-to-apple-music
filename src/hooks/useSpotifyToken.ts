import { useState, useEffect } from "react";
import { SPOTIFY_CLIENT_ID, REDIRECT_URI } from "../config";

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPE = [
  // Read permissions
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-read-recently-played",
  "user-library-read",
  "playlist-read-private",
  "playlist-read-collaborative",

  // Write permissions
  "playlist-modify-public",
  "playlist-modify-private",
  "ugc-image-upload",
].join(" ");

export const useSpotifyToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearTokenAndRedirect = () => {
    window.localStorage.removeItem("spotify_access_token");
    const authUrl = `${AUTH_ENDPOINT}?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}&show_dialog=true`;
    window.location.href = authUrl;
  };

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
      // Verify token and scopes
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (response.status === 403) {
            // Token exists but doesn't have sufficient permissions
            clearTokenAndRedirect();
          } else {
            setToken(accessToken);
          }
        })
        .catch(() => {
          // Token might be expired or invalid
          clearTokenAndRedirect();
        });
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
    clearTokenAndRedirect();
  };

  const handleLogout = () => {
    setToken(null);
    window.localStorage.removeItem("spotify_access_token");
    window.location.reload();
  };

  const forceRefresh = () => {
    clearTokenAndRedirect();
  };

  return { token, authError, handleLogin, handleLogout, forceRefresh };
};
