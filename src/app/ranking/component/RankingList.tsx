"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import TopRankCard from "./TopRankCard";
import RankCard from "./RankCard";

type RankedItem = {
  id: number;
  commentLeng: number;
  checkScore: number;
  totalUserLeng: number;
  commentingUserList: string[];
  rankScore: number;
  meetName: string;
  meetType: string;
};

export default function RankingList() {
  const { data: rankedList } = useSuspenseQuery<RankedItem[]>({
    queryKey: ["ranking"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/ranking");
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const top3List = rankedList.slice(0, 3);
  const top10List = rankedList.slice(3, 10);

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex gap-[16px] pb-[40px]">
        <TopRankCard
          title={top3List[1]?.meetName}
          point={top3List[1]?.rankScore}
          rank={2}
          meetType={top3List[1]?.meetType}
        />
        <TopRankCard
          title={top3List[0]?.meetName}
          point={top3List[0]?.rankScore}
          rank={1}
          meetType={top3List[0]?.meetType}
        />
        <TopRankCard
          title={top3List[2]?.meetName}
          point={top3List[2]?.rankScore}
          rank={3}
          meetType={top3List[2]?.meetType}
        />
      </div>

      <div className="flex flex-col gap-[16px]">
        {top10List.map((item, index) => (
          <RankCard
            key={item.id}
            title={item.meetName}
            point={item.rankScore}
            rank={index + 4}
            meetType={item.meetType}
          />
        ))}
      </div>
    </div>
  );
}
