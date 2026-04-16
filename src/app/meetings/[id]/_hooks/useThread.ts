import { getComments, getThreadPost } from "@/api/client";
import { QUERY_KEYS } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";

export const useMeetingThread = (meetingId: number) => {
  // 1. 스레드 포스트 먼저 조회
  const { data: threadPost, isLoading: isPostLoading } = useQuery({
    queryKey: QUERY_KEYS.threads.detail(meetingId),
    queryFn: () => getThreadPost(meetingId),
  });

  // 2. 포스트 ID가 있으면 댓글 목록 조회 (종속 쿼리)
  const { data: commentsData } = useQuery({
    queryKey: QUERY_KEYS.comments.detail(threadPost?.id || 0),
    queryFn: () => getComments(threadPost!.id, { offset: 0, limit: 100 }),
    enabled: !!threadPost?.id,
  });

  // 3. UI에서 쓰기 편하게 가공해서 반환
  const hasComments = (commentsData?.data?.length || 0) > 0;

  return {
    threadPost,
    isPostLoading,
    hasComments,
  };
};
