"use client";

import { useQuery } from "@tanstack/react-query";
import CommentSection from "@/app/lounge/[id]/component/comment/CommentSection";
import { getThreadPost } from "@/api/posts";

interface MeetingThreadSectionProps {
  meetingId: number;
  canWriteThread: boolean;
  guideText: string;
}

export function MeetingThreadSection({
  meetingId,
  canWriteThread,
  guideText,
}: MeetingThreadSectionProps) {
  const { data: threadPost, isLoading: isPostLoading } = useQuery({
    queryKey: ["meeting-thread-post", meetingId],
    queryFn: () => getThreadPost(meetingId),
  });

  if (isPostLoading) {
    return (
      <div className="p-6 text-center text-gray-400">
        스레드를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <section className="w-full space-y-3 md:space-y-4">
      <h2 className="text-[24px] font-semibold text-gray-900">모임 스레드</h2>
      <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm md:rounded-[24px] md:p-8 xl:rounded-[32px]">
        {canWriteThread && threadPost?.id ? (
          <CommentSection postId={threadPost.id} isThread={true} />
        ) : (
          <div className="rounded-[18px] bg-gray-50 px-5 py-4 text-sm text-gray-600">
            {!threadPost?.id
              ? "아직 스레드 공간이 마련되지 않았습니다."
              : guideText}
          </div>
        )}
      </div>
    </section>
  );
}
