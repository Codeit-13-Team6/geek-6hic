"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getJoinedMeetings } from "@/api/meetings";
import type { JoinedMeetingsResponse } from "@/types";

export function useMeetingQuery() {
  return useInfiniteQuery<JoinedMeetingsResponse>({
    queryKey: ["meetings", "joined"],
    queryFn: ({ pageParam }) =>
      getJoinedMeetings(
        pageParam ? { cursor: pageParam as string, size: 10 } : { size: 10 },
      ),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
  });
}

//목업 데이터
// "use client";
// import { useInfiniteQuery } from "@tanstack/react-query";

// export function useMeetingQuery() {
//   return useInfiniteQuery({
//     queryKey: ["meetings", "joined", "mock"], // 테스트용임을 표시하기 위해 mock 추가

//     queryFn: async ({ pageParam = 0 }) => {
//       // const mockData = Array.from({ length: 10 }).map((_, i) => ({
//       //   id: pageParam + i + 1,
//       //   teamId: "dallaem",
//       //   name: `테스트 모임 ${pageParam + i + 1}`,
//       //   type: "달램핏",
//       //   region: "건대입구",
//       //   dateTime: "2026-03-23T14:00:00.000Z",
//       //   participantCount: 5,
//       //   capacity: 10,
//       //   image: "https://picsum.photos/200/300", // 테스트용 랜덤 이미지
//       // }));
//       const mockData: {
//         id: number;
//         teamId: string;
//         name: string;
//         type: string;
//         region: string;
//         dateTime: string;
//         participantCount: number;
//         capacity: number;
//         image: string;
//       }[] = [];

//       // 2. 전체 데이터가 30개라고 가정하고 종료 조건 설정
//       // const isLastPage = pageParam >= 20; // 0, 10, 20까지 총 3페이지
//       const isLastPage = true; // 빈 데이터 확인용

//       // 3. 사용자가 준 JSON 구조와 똑같이 반환
//       return {
//         data: mockData,
//         nextCursor: isLastPage ? null : pageParam + 10,
//         hasMore: !isLastPage,
//       };
//     },

//     initialPageParam: 0,

//     getNextPageParam: (lastPage) => {
//       // 1. hasMore가 false라면 더 이상 가져올 데이터가 없으므로 undefined 반환
//       if (!lastPage.hasMore) return undefined;
//       // 2. hasMore가 true라면 nextCursor를 반환
//       return lastPage.nextCursor ?? undefined;
//     },
//   });
// }
