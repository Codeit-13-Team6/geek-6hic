import { NextResponse } from "next/server";
import axios from "axios";

export const revalidate = 600;

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const response = await axios.get(`${baseUrl}/posts`, {
      params: {
        sortBy: "createdAt",
        sortOrder: "desc",
        size: 100,
      },
    });

    const allPosts = response.data?.data || [];

    if (!Array.isArray(allPosts)) {
      throw new Error("가져온 데이터가 배열 형식이 아닙니다.");
    }

    // 핫 게시물 알고리즘 실행
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const hotPosts = allPosts
      .filter(
        (post) =>
          post && post.createdAt && new Date(post.createdAt) >= oneWeekAgo,
      )
      .map((post) => {
        const views = post.viewCount || 0;
        const likes = post.likeCount || 0;
        const comments = post._count?.comments || post.comments?.length || 0;

        const hotScore = views * 1 + likes * 3 + comments * 5;
        return { ...post, hotScore };
      })
      .sort((a, b) => b.hotScore - a.hotScore)
      .slice(0, 5);

    return NextResponse.json(hotPosts);
  } catch (error: any) {
    console.error(
      "핫 게시물 생성 실패:",
      error.response?.data || error.message,
    );

    return NextResponse.json(
      { error: "핫 게시물을 불러오지 못했습니다.", detail: error.message },
      { status: 500 },
    );
  }
}
