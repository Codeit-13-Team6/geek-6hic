//
"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export function useMeetingQuery() {
  return useInfiniteQuery({
    queryKey: ["meetings", "joined"],

    // 2. Axios를 사용한 데이터 페칭
    queryFn: async ({ pageParam }) => {
      // BFF(route.ts)로 요청을 보냅니다.
      // 커서가 있으면 쿼리 스트링으로 붙이고, 없으면(첫 로드) 생략합니다.
      const { data } = await axios.get("/api/meetings/joined", {
        params: {
          cursor: pageParam,
          size: 10, // 한 번에 가져올 개수
        },
      });
      return data;
    },

    // 3. 첫 페이지 로드 시 커서 값 (Next.js 15 + v5 필수)
    initialPageParam: 0,

    // 4. 다음 페이지를 위한 커서 추출 로직
    getNextPageParam: (lastPage) => {
      // 1. hasMore가 false라면 더 이상 가져올 데이터가 없으므로 undefined 반환
      if (!lastPage.hasMore) return undefined;
      // 2. hasMore가 true라면 nextCursor를 반환 (다음 요청의 pageParam이 됨)
      return lastPage.nextCursor ?? undefined;
    },
  });
}
