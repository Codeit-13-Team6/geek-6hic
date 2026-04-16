import { Post } from "@/types";


const THREAD_PREFIX = "isThread";
const SEPARATOR = "_";

export const isThread = {
  build: (meetingId: number) => `${THREAD_PREFIX}${SEPARATOR}${meetingId}`,

  is: (title?: string) => {
    if (!title) return false;
    return title.split(SEPARATOR)[0] === THREAD_PREFIX;
  },
} as const;


export const filterThreadPosts = <T extends { data: Post[] }>(
  response: T,
): T => {
  const filteredPosts = response.data.filter(
    (post) => !isThread.is(post.title),
  );

  return { ...response, data: filteredPosts };
};
