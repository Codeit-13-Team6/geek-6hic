import { Post } from "@/types";

export const filterThreadPosts = <T extends { data: Post[] }>(
  response: T,
): T => {
  const isNotThread = (title?: string) => {
    if (!title) return true;
    return title.split("_")[0] !== "isThread";
  };

  const filteredPosts = response.data.filter((post) => isNotThread(post.title));

  return { ...response, data: filteredPosts };
};
