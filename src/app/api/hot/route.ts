import { NextResponse } from "next/server";
import { GetPostsParams, Post } from "@/types";
import { serverAxios } from "@/lib/server-fetcher";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const revalidate = 600; // 10분마다 갱신 (캐싱)

export async function GET() {
  try {
    // 1. 커트라인 날짜(일주일 전) 세팅
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let cursor: string | undefined = undefined;
    const allValidPosts: Post[] = [];
    let isOlderThanAWeek = false;

    let loopCount = 0; // 무한 루프 방지용 카운터
    const MAX_LOOP = 20; // 최대 요청 제한 (백엔드 에러 대비)

    // 2. 체인 방식(Cursor)으로 데이터 뽑아오기
    while (loopCount < MAX_LOOP) {
      loopCount++;

      // 커서가 있으면 넣고 없으면 첫 페이지
      const params: GetPostsParams = {
        sortBy: "createdAt",
        sortOrder: "desc", // 최신순
        size: 20,
      };
      if (cursor) params.cursor = cursor;

      const { data: response } = await serverAxios.get(
        `${API_BASE_URL}/posts`,
        {
          params,
        },
      );
      const posts = response.data || [];

      // 3. 가져온 데이터가 일주일보다 오래된지 하나씩 검사
      for (const post of posts) {
        const postDate = new Date(post.createdAt);

        if (postDate < oneWeekAgo) {
          // 최신순 정렬이므로 이 뒤로는 안봐도 됨
          isOlderThanAWeek = true;
          break;
        }

        // 스레드 게시물은 점수 계산 후보에서 아예 제외
        const title = post?.title;
        if (title.split("_")[0] === "isThread") {
          continue;
        }

        allValidPosts.push(post);
      }

      if (isOlderThanAWeek || !response.hasMore || !response.nextCursor) {
        break;
      }

      cursor = response.nextCursor;
    }

    // 5. 수집된 '일주일치 전체' 데이터로 시간 가중치 알고리즘 실행
    const GRAVITY = 1.8; // 중력 계수 (높을수록 빠르게 최신화)
    const nowTime = Date.now();

    const hotPosts = allValidPosts
      .map((post) => {
        const views = post.viewCount || 0;
        const likes = post.likeCount || 0;
        const comments = post._count?.comments || post.comments?.length || 0;

        const baseScore = views * 1 + likes * 3 + comments * 5;

        // 경과 시간 계산 (단위: 시간)
        const postTime = new Date(post.createdAt).getTime();
        const hoursSincePosted = (nowTime - postTime) / (1000 * 60 * 60);

        // 시간 가중치 공식 적용
        // 분모에 +2를 하는 이유는 방금 막 올라온 글이 무한대 점수를 받는 걸 방지하기 위해서
        const hotScore = baseScore / Math.pow(hoursSincePosted + 2, GRAVITY);

        return { ...post, hotScore };
      })
      .sort((a, b) => b.hotScore - a.hotScore)
      .slice(0, 5);

    return NextResponse.json(hotPosts ?? []);
  } catch (error: any) {
    console.error(
      "Hot Posts BFF Error:",
      error.response?.data || error.message,
    );
    return NextResponse.json(
      { error: "핫 게시물을 불러오지 못했습니다.", detail: error.message },
      { status: 500 },
    );
  }
}
