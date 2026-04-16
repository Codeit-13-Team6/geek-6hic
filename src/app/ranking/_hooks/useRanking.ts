import { QUERY_KEYS } from "@/constants/queryKey";
import axiosInstance from "@/lib/auth/fetcher.client";
import { RankedItem } from "@/types";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useRanking = () => {
  return useSuspenseQuery<RankedItem[]>({
    queryKey: QUERY_KEYS.ranking.root,
    queryFn: async () => {
      const { data } = await axiosInstance.get("/ranking");
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
};
