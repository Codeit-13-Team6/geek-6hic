"use client";

import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/api/client/comments";
import { useAuthStore } from "@/store/useAuthStore";
import { BtnCommon } from "@/components/ui/BtnCommon";
import Comment from "./Comment";
import { ToastCommon } from "@/components/ui/ToastCommon";
import { CompactLinkList } from "@/components/features/list/CompactLinkList";
import { extractUrlsFromText } from "@/lib/contentLinkUtils";
import { TextareaCommon } from "@/components/ui/TextareaCommon";
import { CommentSectionProps, GetCommentsResponse } from "@/types";
import { useOptimisticMutation } from "@/hooks/useOptimisticUpdate";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import { QUERY_KEYS } from "@/constans/queryKey";

export default function CommentSection({
  postId,
  isThread = false,
}: CommentSectionProps) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
  const loginGuardAction = useLoginModalStore((s) => s.loginGuardAction);

  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [threadContent, setThreadContent] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const linkObjects = extractUrlsFromText(threadContent);

  const { data: comments } = useQuery({
    queryKey: QUERY_KEYS.comments.detail(postId),
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });

  const commentsList = comments?.data || [];

  const { mutate: postComment, isPending: isPosting } = useMutation({
    mutationFn: (newContent: string) => createComment(postId, newContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments.detail(postId) });


      if (isThread) {
        setThreadContent(""); // 스레드 입력창(state) 초기화
      } else if (commentRef.current) {
        commentRef.current.value = ""; // 일반 댓글창(ref) 초기화
      }
    },
    onError: () => {
      ToastCommon({ message: "댓글 등록에 실패했습니다.", size: "sm" });
    },
  });

  const { mutate: removeComment } = useMutation({
    mutationFn: (commentId: number) => deleteComment(postId, commentId),
    ...useOptimisticMutation<GetCommentsResponse, number>(queryClient, {
      queryKey: QUERY_KEYS.comments.detail(postId),
      updater: (old, commentId) => ({
        ...old,
        data: old.data.filter((c) => c.id !== commentId),
      }),
      invalidateKeys: [QUERY_KEYS.comments.detail(postId)],
      onErrorMessage: "댓글 삭제에 실패했습니다.",
    }),
    onSuccess: () => {
      ToastCommon({ message: "댓글이 삭제되었습니다.", size: "sm" });
    },
  });

  const { mutate: editComment } = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => updateComment(postId, commentId, content),
    ...useOptimisticMutation<
      GetCommentsResponse,
      { commentId: number; content: string }
    >(queryClient, {
      queryKey: QUERY_KEYS.comments.detail(postId),
      updater: (old, { commentId, content }) => ({
        ...old,
        data: old.data.map((c) => (c.id === commentId ? { ...c, content } : c)),
      }),
      invalidateKeys: [["comments", postId]],
      onErrorMessage: "댓글 수정에 실패했습니다.",
    }),
    onSuccess: () => {
      ToastCommon({ message: "댓글이 수정되었습니다.", size: "sm" });
    },
  });

  const handlePostComment = () => {
    // 실시간 카드 리스트로 발생하는 렌더링 최적화
    const value = isThread ? threadContent : commentRef.current?.value || "";
    if (!value.trim())
      return ToastCommon({
        message: "내용을 입력해주세요.",
        size: "sm",
      });

    postComment(value);
  };

  const handleEdit = (commentId: number, newContent: string) => {
    editComment({ commentId, content: newContent });
  };

  const handleDelete = (commentId: number) => {
    setDeleteTargetId(commentId);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      removeComment(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <section
      className={`mt-10 flex flex-col gap-6 ${isThread ? "" : ""}`}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-bold tracking-tighter text-slate-900 sm:text-xl">
          {isThread ? null : "COMMENTS"}
        </h3>
        <span className="text-main-purple rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-bold">
          {isThread ? null : commentsList.length || 0}
        </span>
      </div>

      {isThread ? (
        <div className="-mt-10 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <TextareaCommon
              value={threadContent}
              placeholder="메시지나 공유할 링크를 자유롭게 입력해주세요."
              onChange={(event) => setThreadContent(event.target.value)}
              className="focus:!border-main-purple/80 !h-12 !rounded-xl !border-slate-100 !bg-slate-50 focus:!bg-white"
              disabled={isPosting}
              maxLength={999}
            />
            <div className="flex justify-end">
              <BtnCommon
                className="h-11 w-full !rounded-xl text-sm font-bold sm:w-24"
                onClick={() => loginGuardAction(handlePostComment)}
                disabled={!threadContent.trim() || isPosting}
              >
                {isPosting ? "..." : "작성하기"}
              </BtnCommon>
            </div>
          </div>
          {linkObjects.length > 0 && (
            <>
              <span className="block text-xs font-bold text-slate-300 uppercase">
                링크 미리보기
              </span>
              <div className="rounded-2xl border border-slate-200 bg-white p-2">
                <CompactLinkList links={linkObjects} isPreview={true} />
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="group relative flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 bg-white p-3 transition-colors">
          <textarea
            ref={commentRef}
            rows={2}
            disabled={isPosting}
            placeholder="여기에 댓글을 남겨보세요."
            className="w-full resize-none border-none bg-transparent px-2 pt-2 text-[15px] leading-relaxed text-slate-700 placeholder:text-slate-300 focus:ring-0 focus:outline-none"
            maxLength={999}
          />
          <div className="flex justify-end">
            <BtnCommon
              onClick={() => loginGuardAction(handlePostComment)}
              disabled={isPosting}
              className="h-10 w-20 !rounded-xl text-sm font-bold"
            >
              등록
            </BtnCommon>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col divide-y divide-slate-200/60">
        {commentsList.map((item) =>
          item.content.split("_")[0] !== "onlyScore" ? (
            <Comment
              key={item.id}
              id={item.id}
              name={item.author.name}
              img={item.author.image}
              content={item.content}
              date={new Date(item.createdAt)}
              isOwner={userId !== null && userId === item.author.id}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ) : (
            <div key={item.id} className="hidden" />
          ),
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={deleteTargetId !== null}
        onOpenChange={(isOpen) => !isOpen && setDeleteTargetId(null)}
        title="DELETE COMMENT"
        description="댓글을 삭제하시겠습니까?"
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
