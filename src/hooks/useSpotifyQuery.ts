import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

/**
 * Custom React hook for fetching data from a Spotify API endpoint using react-query.
 *
 * This hook uses `useQuery` to fetch data once or on-demand from a specified endpoint.
 * It requires a valid Spotify authorization token and returns the query result with
 * automatic caching, refetching, and error handling managed by react-query.
 *
 * @template T - The type of data returned by the API.
 *
 * @param {string | null} token - The authorization token for accessing the Spotify API.
 * @param {string} endpoint - The Spotify API endpoint to fetch data from.
 * @param {string} queryKey - The unique key for the query to identify it in the react-query cache.
 * @param {boolean} [enabled=true] - Whether the query is enabled and should automatically run.
 * @returns {UseQueryResult<T, Error>} The query result, containing the fetched data, loading state, and any error encountered.
 * @property {T | undefined} data - The data returned from the Spotify API, or undefined if not yet loaded.
 * @property {boolean} isLoading - Indicates if the query is currently loading data.
 * @property {Error | null} error - Any error encountered during data fetching.
 *
 * @example
 * const { data, isLoading, error } = useSpotifyQuery<SpotifyTrack>(
 *   token,
 *   "https://api.spotify.com/v1/me/tracks",
 *   "likedTracks"
 * );
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return (
 *   <div>
 *     {data?.map((track) => (
 *       <div key={track.id}>{track.name}</div>
 *     ))}
 *   </div>
 * );
 */
export const useSpotifyQuery = <T>(
  token: string | null,
  endpoint: string,
  queryKey: string,
  enabled: boolean = true
): UseQueryResult<T, Error> => {
  return useQuery<T, Error>({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await axios.get<T>(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled,
  });
};
