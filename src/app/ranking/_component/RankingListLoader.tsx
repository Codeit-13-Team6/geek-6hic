"use client";

import dynamic from "next/dynamic";
import RankingListSkeleton from "@/components/skeleton/RankingListSkeleton";

const RankingList = dynamic(() => import("./RankingList"), {
  ssr: false,
  loading: () => <RankingListSkeleton />,
});

export default function RankingListLoader() {
  return <RankingList />;
}
