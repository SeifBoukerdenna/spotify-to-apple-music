import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useSpotifyQuery = <T>(
  token: string | null,
  endpoint: string,
  queryKey: string,
  enabled: boolean = true
) => {
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
