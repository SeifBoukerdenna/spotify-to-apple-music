import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

interface PageData<T> {
  items: T[];
  next: string | null;
}

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
