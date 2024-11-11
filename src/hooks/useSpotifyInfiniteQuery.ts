import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

interface PageData<T> {
  items: T[];
  next: string | null;
}

/**
 * Custom React hook for managing infinite scroll data fetching with Spotify API using react-query.
 *
 * This hook uses `useInfiniteQuery` to fetch paginated data from a specified Spotify API endpoint,
 * handling pagination automatically. Optionally, a data processor function can be applied to the
 * fetched items to format or transform the data.
 *
 * @template TItem - The type of each item fetched from the endpoint.
 * @template TData - The type of each item after processing (if a data processor is provided).
 *
 * @param {string | null} token - The authorization token for accessing the Spotify API.
 * @param {string} endpoint - The Spotify API endpoint to fetch data from.
 * @param {string} queryKey - The unique key for the query to identify it in the react-query cache.
 * @param {number} [limit=50] - The number of items to fetch per page request. Default is 50.
 * @param {boolean} [enabled=true] - Whether the query is enabled and should automatically run.
 * @param {number} [initialPageParam=0] - The initial offset or page parameter for pagination.
 * @param {function} [dataProcessor] - Optional function to process each item in the response.
 * @returns {Object} The infinite query result object with additional `items` property for combined and processed data.
 * @property {TData[]} items - The processed items or raw items from all fetched pages.
 *
 * @example
 * const { items, fetchNextPage, hasNextPage, isLoading } = useSpotifyInfiniteQuery(
 *   token,
 *   "https://api.spotify.com/v1/me/tracks",
 *   "likedTracks",
 *   50,
 *   true,
 *   0,
 *   (items) => items.map(item => item.track)
 * );
 *
 * if (isLoading) return <div>Loading...</div>;
 * return (
 *   <div>
 *     {items.map((track, index) => (
 *       <div key={index}>{track.name}</div>
 *     ))}
 *     {hasNextPage && <button onClick={fetchNextPage}>Load More</button>}
 *   </div>
 * );
 */
export const useSpotifyInfiniteQuery = <TItem, TData>(
  token: string | null,
  endpoint: string,
  queryKey: string,
  limit: number = 50,
  enabled: boolean = true,
  initialPageParam: number = 0,
  dataProcessor?: (items: TItem[]) => TData[]
) => {
  const infiniteQueryResult = useInfiniteQuery<PageData<TItem>, Error>({
    queryKey: [queryKey],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam;
      const response = await axios.get<PageData<TItem>>(
        `${endpoint}?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        items: response.data.items,
        next: response.data.next,
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        const offsetParam = url.searchParams.get("offset");
        return offsetParam ? parseInt(offsetParam, 10) : undefined;
      } else {
        return undefined;
      }
    },
    enabled,
    initialPageParam,
  });

  const combinedItems = React.useMemo(() => {
    const items =
      infiniteQueryResult.data?.pages.flatMap((page) => page.items) || [];
    if (dataProcessor) {
      return dataProcessor(items);
    }
    return items as unknown as TData[];
  }, [infiniteQueryResult.data, dataProcessor]);

  return {
    ...infiniteQueryResult,
    items: combinedItems,
  };
};
