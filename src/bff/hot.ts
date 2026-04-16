import { Post } from "@/types";
import { getPosts } from "@/api/server";
import { fetchAllCursor } from "@/lib/fetchAllCursor";
import { threadKeyword } from "@/lib/threadKeyword";

export async function getHotPostsBFF(): Promise<Post[]> {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const allValidPosts = await fetchAllCursor<Post>({
    fetchPage: (cursor) =>
      getPosts({ cursor, size: 20, sortBy: "createdAt", sortOrder: "desc" }),
    earlyExit: (post) => new Date(post.createdAt) < oneWeekAgo,
    filter: (post) => !threadKeyword.is(post.title),
  });

  const GRAVITY = 0.8;
  const nowTime = Date.now();

  return allValidPosts
    .map((post) => {
      const views = post.viewCount || 0;
      const likes = post.likeCount || 0;
      const comments = post._count?.comments || post.comments?.length || 0;

      const baseScore = views * 1 + likes * 3 + comments * 5;

      const postTime = new Date(post.createdAt).getTime();
      const hoursSincePosted = (nowTime - postTime) / (1000 * 60 * 60);

      const hotScore = baseScore / Math.pow(hoursSincePosted + 24, GRAVITY);

      return { ...post, hotScore };
    })
    .sort((a, b) => b.hotScore - a.hotScore)
    .slice(0, 5);
}
