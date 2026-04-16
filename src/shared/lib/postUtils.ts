import { Post } from "@/shared/types";
import { threadKeyword } from "@/shared/lib/threadKeyword";

export const filterThreadPosts = <T extends { data: Post[] }>(
  response: T,
): T => {

  const filteredPosts = response.data.filter(
    (post) => !threadKeyword.is(post.title),
  );

  return { ...response, data: filteredPosts };
};
