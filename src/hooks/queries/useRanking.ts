import { QUERY_KEYS } from "@/constans/queryKey";
import axiosInstance from "@/lib/clientFetcher";
import { RankedItem } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useRanking = () => {
  return useQuery<RankedItem[]>({
    queryKey: QUERY_KEYS.ranking.root,
    queryFn: async () => {
      const { data } = await axiosInstance.get("/ranking");
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
};
