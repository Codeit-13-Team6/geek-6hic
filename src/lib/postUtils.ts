import { Post } from "@/types";
import { threadKeyword } from "@/constans/post";

export const filterThreadPosts = <T extends { data: Post[] }>(
  response: T,
): T => {

  const filteredPosts = response.data.filter(
    (post) => !threadKeyword.is(post.title),
  );

  return { ...response, data: filteredPosts };
};
