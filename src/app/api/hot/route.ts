import { NextResponse } from "next/server";
import {  Post } from "@/types";
import { fetchPosts } from "@/api";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const revalidate = 600; // 10분마다 갱신 (캐싱)

export async function GET() {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let cursor: string | undefined = undefined;
    const allValidPosts: Post[] = [];
    let isOlderThanAWeek = false;

    let loopCount = 0;
    const MAX_LOOP = 20; // 최대 요청 제한 (백엔드 에러 대비)

    // 체인 방식(Cursor)으로 데이터 뽑아오기
    while (loopCount < MAX_LOOP) {
      loopCount++;

      // const params: GetPostsParams = {
      //   sortBy: "createdAt",
      //   sortOrder: "desc", // 최신순
      //   size: 20,
      // };
      // if (cursor) params.cursor = cursor;
      // const { data: response } = await serverAxios.get(
      //   `${API_BASE_URL}/posts`,
      //   {
      //     params,
      //   },
      // );

      const response = await fetchPosts(cursor);

      const posts = response.data || [];

      // 가져온 데이터가 일주일보다 오래된지 하나씩 검사
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

    // 수집된 '일주일치 전체' 데이터로 시간 가중치 알고리즘 실행
    const GRAVITY = 0.8; // 중력 계수 (높을수록 빠르게 최신화)
    const nowTime = Date.now();

    const hotPosts = allValidPosts
      .map((post) => {
        const views = post.viewCount || 0;
        const likes = post.likeCount || 0;
        const comments = post._count?.comments || post.comments?.length || 0;

        const baseScore = views * 1 + likes * 3 + comments * 5;

        const postTime = new Date(post.createdAt).getTime();
        const hoursSincePosted = (nowTime - postTime) / (1000 * 60 * 60);

        // 시간 가중치 공식 적용
        const hotScore = baseScore / Math.pow(hoursSincePosted + 24, GRAVITY);

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
