const THREAD_PREFIX = "isThread";
const SEPARATOR = "_";

export const threadKeyword = {
  build: (meetingId: number) => `${THREAD_PREFIX}${SEPARATOR}${meetingId}`,

  is: (title?: string) => {
    if (!title) return false;
    return title.split(SEPARATOR)[0] === THREAD_PREFIX;
  },
} as const;
