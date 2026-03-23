//내가 참여한 모임 불러오는 무한스크롤링 로직
"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export function useMeetingQuery() {
  return useInfiniteQuery({
    // 1. 탭이 없으므로 고정된 키를 사용합니다.
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
    initialPageParam: undefined,

    // 4. 다음 페이지를 위한 커서 추출 로직
    getNextPageParam: (lastPage) => {
      // 서버 응답 구조가 { data: [...], nextCursor: "..." }라고 가정
      return lastPage.nextCursor ?? undefined;
    },
  });
}
