"use client";

import TopRankCard from "./TopRankCard";
import TopRankMobileCard from "./TopRankMobileCard";
import RankCard from "./RankCard";
import { useRouter } from "next/navigation";
import { useRanking } from "@/hooks/queries/useRanking";

export default function RankingList() {
  const router = useRouter();

  const { data: rankedList } = useRanking();

  const top3List = rankedList.slice(0, 3);
  const top10List = rankedList.slice(3, 20);

  return (
    <div className="animate-fade-up">
      <section className="mb-10 md:mb-15" aria-labelledby="ranking-top3-title">
        {/* 데스크톱 & 태블릿 */}
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
        {/* 10위까지 랭킹 */}
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
