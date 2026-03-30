"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/clientFetcher";
import TopRankCard from "./TopRankCard";
import RankCard from "./RankCard";
import { useRouter } from "next/navigation";
import { RankedItem } from "@/types";

export default function RankingList() {
  const { data: rankedList } = useSuspenseQuery<RankedItem[]>({
    queryKey: ["ranking"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/ranking");
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const router = useRouter();
  const top3List = rankedList.slice(0, 3);
  const top10List = rankedList.slice(3, 10);

  return (
    <div className="animate-in fade-in duration-700">
      <div className="pt-5 sm:pt-10">
        <div className="flex gap-2 pb-5 sm:gap-[16px] sm:pb-[40px]">
          <div className="min-w-0 flex-1 basis-0">
            {" "}
            <TopRankCard
              title={top3List[1]?.meetName}
              point={top3List[1]?.rankScore}
              rank={2}
              meetType={top3List[1]?.meetType}
              onDetailClick={() => router.push(`/meetings/${top3List[1]?.id}`)}
            />
          </div>

          <div className="flex-1 -translate-y-5 sm:-translate-y-10">
            <TopRankCard
              title={top3List[0]?.meetName}
              point={top3List[0]?.rankScore}
              rank={1}
              meetType={top3List[0]?.meetType}
              onDetailClick={() => router.push(`/meetings/${top3List[0]?.id}`)}
            />
          </div>
          <div className="flex-1">
            {" "}
            <TopRankCard
              title={top3List[2]?.meetName}
              point={top3List[2]?.rankScore}
              rank={3}
              meetType={top3List[2]?.meetType}
              onDetailClick={() => router.push(`/meetings/${top3List[3]?.id}`)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[16px]">
        {top10List.map((item, index) => (
          <RankCard
            key={item.id}
            title={item.meetName}
            point={item.rankScore}
            rank={index + 4}
            meetType={item.meetType}
            onDetailClick={() => router.push(`/meetings/${item.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
