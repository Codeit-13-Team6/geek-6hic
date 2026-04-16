import { QUERY_KEYS } from "@/shared/constants/queryKey";
import axiosInstance from "@/infra/auth/fetcher.client";
import { RankedItem } from "@/shared/types";
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
