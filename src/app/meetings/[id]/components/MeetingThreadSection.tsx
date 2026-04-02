"use client";

import { useQuery } from "@tanstack/react-query";
import { getThreadPost } from "@/api/client/posts";
import { MeetingThreadSectionProps } from "@/types";
import CommentSection from "@/components/features/comment/CommentSection";
import { MessagesSquare, LockKeyhole, Loader2 } from "lucide-react";
import { getComments } from "@/api/client";
import { cn } from "@/lib/utils";
import { QUERY_KEYS } from "@/constans/queryKey";

export function MeetingThreadSection({
  meetingId,
  canWriteThread,
  guideText,
}: MeetingThreadSectionProps) {
  const { data: threadPost, isLoading: isPostLoading } = useQuery({
    queryKey: ["meeting-thread-post", meetingId],
    queryFn: () => getThreadPost(meetingId),
  });

  const { data: commentsData } = useQuery({
    queryKey: QUERY_KEYS.comments.detail(threadPost?.id || 0),
    queryFn: () => getComments(threadPost!.id),
    enabled: !!threadPost?.id,
  });

  const hasComments = (commentsData?.data?.length || 0) > 0;

  if (isPostLoading) {
    return (
      <div className="flex min-h-[300px] w-full flex-col items-center justify-center gap-4 rounded-[40px] border border-slate-50 bg-white shadow-sm">
        <Loader2 size={24} className="text-main-purple/40 animate-spin" />
        <p className="text-xs font-black tracking-widest text-slate-300 uppercase">
          Loading Thread...
        </p>
      </div>
    );
  }

  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col gap-1 px-2">
        <div className="text-main-purple flex items-center gap-2">
          <MessagesSquare size={18} strokeWidth={3} />
          <h2 className="text-xl font-black tracking-tighter text-slate-950 sm:text-2xl">
            모임 스레드
          </h2>
        </div>
        <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">
          Community Thread
        </p>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-slate-50 bg-white p-6 shadow-sm sm:p-10 xl:rounded-[40px]">
        {!canWriteThread && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-slate-100/40 text-slate-300">
              <LockKeyhole size={24} />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-black tracking-tight text-slate-950">
                비공개 공간
              </p>
              <p className="text-sm leading-relaxed font-bold text-slate-400">
                {guideText}
              </p>
            </div>
          </div>
        )}

        {canWriteThread &&
          (!threadPost?.id ? (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-slate-100/40 text-slate-300">
                <LockKeyhole size={24} />
              </div>
              <div className="max-w-auto space-y-2">
                <p className="text-lg font-black tracking-tight text-slate-950">
                  {!threadPost?.id ? "스레드 준비 중" : "비공개 공간"}
                </p>
                <p className="text-sm leading-relaxed font-bold text-slate-400">
                  {!threadPost?.id
                    ? "아직 스레드 공간이 마련되지 않았습니다. 잠시만 기다려 주세요!"
                    : guideText}
                </p>
              </div>
            </div>
          ) : threadPost._count.comments === 0 ? (
            <div
              className={cn(
                "animate-in fade-in zoom-in-95 flex flex-col duration-500",
                !hasComments && "items-center justify-center text-center",
              )}
            >
              <div className="w-full">
                <CommentSection postId={threadPost.id} isThread={true} />
              </div>

              {!hasComments && (
                <div className="animate-in fade-in zoom-in-95 flex flex-col items-center duration-500">
                  <div className="bg-main-purple/5 text-main-purple flex size-14 items-center justify-center rounded-[28px]">
                    <MessagesSquare size={24} strokeWidth={2} />
                  </div>
                  <p className="my-4 text-sm font-bold text-slate-400">
                    아직 등록된 스레드가 없습니다. 먼저 인사를 건네보세요!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <CommentSection postId={threadPost.id} isThread={true} />
            </div>
          ))}
      </div>
    </section>
  );
}
