"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/clientFetcher";
import TopRankCard from "./TopRankCard";
import TopRankMobileCard from "./TopRankMobileCard";
import RankCard from "./RankCard";
import { useRouter } from "next/navigation";
import { RankedItem } from "@/types";
import RankingListSkeleton from "@/components/skeleton/RankingListSkeleton";
import { QUERY_KEYS } from "@/constans/queryKey";

export default function RankingList() {
  const router = useRouter();


  const { data: rankedList, isLoading } = useQuery<RankedItem[]>({
    queryKey: QUERY_KEYS.ranking.root,
    queryFn: async () => {
      const { data } = await axiosInstance.get("/ranking");
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading || !rankedList) return <RankingListSkeleton />;

  const top3List = rankedList.slice(0, 3);
  const top10List = rankedList.slice(3, 10);

  return (
    <div className="animate-fade-up">
    {/* <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000"> */}
      <div className="animate-fade-up mb-20 flex items-center gap-3">
        <div
          className="bg-main-purple h-[6px] w-8 rounded-full"
          aria-hidden="true"
        />
        <h2 id="ranking-top3-title" className="text-xs font-black tracking-[0.3em] text-slate-900 uppercase">
          TOP 3
        </h2>
      </div>

      <section
        className="mb-10 md:mb-15"
        aria-labelledby="ranking-top3-title"
      >
        {/* 1데스크톱 & 태블릿 */}
        <ul className="hidden items-end gap-6 md:flex lg:gap-10">
          <li className="flex-1">
            <TopRankCard
              rank={2}
              item={top3List[1]}
              onDetailClick={() => router.push(`/meetings/${top3List[1]?.id}`)}
            />
          </li>
          <li className="flex-1 -translate-y-8">
            <TopRankCard
              rank={1}
              item={top3List[0]}
              onDetailClick={() => router.push(`/meetings/${top3List[0]?.id}`)}
            />
          </li>
          <li className="flex-1">
            <TopRankCard
              rank={3}
              item={top3List[2]}
              onDetailClick={() => router.push(`/meetings/${top3List[2]?.id}`)}
            />
          </li>
        </ul>

        {/* 모바일 */}
        <ul className="flex flex-col gap-3 md:hidden">
          {top3List.map((item, idx) => (
            <TopRankMobileCard
              key={item.id || idx}
              rank={idx + 1}
              item={item}
              onDetailClick={() => router.push(`/meetings/${item.id}`)}
            />
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-1 sm:gap-2">
        {top10List.map((item, index) => (
          <RankCard
            key={item.id}
            title={item.meetName}
            point={item.rankScore}
            rank={index + 4}
            meetType={item.meetType}
            image={item.image}
            onDetailClick={() => router.push(`/meetings/${item.id}`)}
          />
        ))}
      </section>
    </div>
  );
}
