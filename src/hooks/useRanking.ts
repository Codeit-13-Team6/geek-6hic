"use client";

import { useQuery } from "@tanstack/react-query";
import { getMeetings } from "@/api/meeting";
import { useEffect, useMemo } from "react";
import { getReview } from "@/api/review";

type MeetingRankData = {
  commentLeng: number;
  checkScore: number;
  totalUserLeng: number;
  commentingUserList: string[];
  rankScore: number;
  meetName: string;
  meetType: string;
};

type MeetingRankMap = Record<number, MeetingRankData>;

export function useRanking() {



  const { data: meetingMap } = useQuery({
    queryKey: ["meetings", "all-ids"],
    queryFn: async () => {
      const meetingMap: MeetingRankMap = {};

      let cursor = undefined;

      while (true) {
        const res = await getMeetings({ cursor: cursor });

        res.data.forEach((item: any) => {
          meetingMap[item.id] = {
            totalUserLeng: item.participantCount,
            commentLeng: 0,
            checkScore: 0,
            commentingUserList: [],
            meetType: item.type,
            meetName: item.name,
            rankScore: 0,
          };
        });

        if (!res.hasMore) break;
        cursor = res.nextCursor;
      }

      return meetingMap;
    },
    refetchOnWindowFocus: false,
  });

  const { data: reviewMap, isSuccess: isRankingReady } = useQuery({
    queryKey: ["reviews", "all"],
    queryFn: async () => {
      // 타입 에러로 인한 처리
      if (!meetingMap) return {};

      let cursor = undefined;
      const updatedMap = { ...meetingMap };

      while (true) {
        const res = await getReview({ cursor: cursor });

        res.data.forEach((item: any) => {
          if (meetingMap.hasOwnProperty(item.meeting.id)) {
            meetingMap[item.meeting.id].commentingUserList = [
              ...meetingMap[item.meeting.id].commentingUserList,
              item.userId,
            ];

            meetingMap[item.meeting.id].commentLeng =
              meetingMap[item.meeting.id].commentLeng + 1;

            meetingMap[item.meeting.id].checkScore =
              meetingMap[item.meeting.id].checkScore + item.score;
          }
        });

        if (!res.hasMore) break;
        cursor = res.nextCursor;
      }

      return updatedMap;
    },
    refetchOnWindowFocus: false,
    enabled: !!meetingMap,
  });

  const rankedList = useMemo(() => {
    if (!reviewMap) return [];

    return Object.entries(reviewMap)
      .map(([id, data]) => ({
        id: Number(id),
        ...data,
        rankScore:
          data.commentLeng * 3 +
          data.checkScore +
          data.commentingUserList.length * 30,
      }))
      .sort((a, b) => b.rankScore - a.rankScore);
  }, [reviewMap]);



  const top3List = rankedList.slice(0, 3);
  const top10List = rankedList.slice(3, 10);

  return { rankedList, top3List, top10List, isRankingReady };
}
