"use client";

import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/api/comments";
import { useAuthStore } from "@/store/useAuthStore";
import { BtnCommon } from "@/components/ui/BtnCommon";
import Comment from "./Comment";
import { ToastCommon } from "@/components/ui/ToastCommon";
import ModalBase from "@/components/ui/ModalBase";
import { CompactLinkList } from "@/components/features/list/CompactLinkList";
import { extractUrlsFromText } from "@/lib/contentLinkUtils";
import { TextareaCommon } from "@/components/ui/TextareaCommon";
import { cn } from "@/lib/utils";

export default function CommentSection({ postId, isThread = false }: any) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [threadContent, setThreadContent] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const linkObjects = extractUrlsFromText(threadContent);

  const { data: comments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });
  const commentsList = comments?.data || [];

  const { mutate: postComment, isPending: isPosting } = useMutation({
    mutationFn: (newContent: string) => createComment(postId, newContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (isThread) setThreadContent("");
      else if (commentRef.current) commentRef.current.value = "";
    },
    onError: () =>
      ToastCommon({ message: "댓글 등록에 실패했습니다.", size: "sm" }),
  });

  const { mutate: removeComment } = useMutation({
    mutationFn: (commentId: number) => deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      ToastCommon({ message: "댓글이 삭제되었습니다.", size: "sm" });
    },
  });

  const { mutate: editComment } = useMutation({
    mutationFn: ({ commentId, content }: any) =>
      updateComment(postId, commentId, content),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });

  const handlePostComment = () => {
    const value = isThread ? threadContent : commentRef.current?.value || "";
    if (!value.trim()) return;
    postComment(value);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      removeComment(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <section className="mt-20 flex flex-col gap-10">
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
        <h3 className="text-sm font-black tracking-[0.2em] text-slate-950 uppercase">
          Discussion{" "}
          <span className="ml-2 text-[#260656]">{commentsList.length}</span>
        </h3>
      </div>

      {/* 1. 댓글 입력창: 묵직한 필드 형태 (댓글 목록과 확실히 차별화) */}
      <div className="relative rounded-2xl border-2 border-slate-100 bg-white p-5 transition-all focus-within:border-[#260656] focus-within:ring-4 focus-within:ring-[#260656]/5">
        <textarea
          ref={isThread ? null : commentRef}
          value={isThread ? threadContent : undefined}
          onChange={
            isThread ? (e) => setThreadContent(e.target.value) : undefined
          }
          rows={isThread ? 5 : 3}
          disabled={isPosting}
          placeholder={isPosting ? "기록 중..." : "의견을 자유롭게 남겨주세요."}
          className="w-full resize-none border-none bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-300 focus:ring-0 sm:text-base"
        />
        <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
          <p className="text-[10px] font-bold tracking-tight text-slate-400 uppercase">
            Co-git Community Archive
          </p>
          <button
            onClick={handlePostComment}
            disabled={isPosting || (isThread ? !threadContent.trim() : false)}
            className="rounded-lg bg-[#260656] px-8 py-3 text-xs font-black tracking-widest text-white transition-all hover:bg-[#1a043d] active:scale-95 disabled:opacity-30"
          >
            {isPosting ? "POSTING..." : "REGISTER"}
          </button>
        </div>
        {linkObjects.length > 0 && isThread && (
          <div className="mt-4 border-t border-slate-50 pt-4">
            <CompactLinkList links={linkObjects} isPreview={true} />
          </div>
        )}
      </div>

      {/* 2. 댓글 목록: 리스트 형태로 쫙 깔리는 디자인 (카드 느낌 제거) */}
      <div className="flex flex-col">
        {commentsList.map((item: any) => (
          <Comment
            key={item.id}
            id={item.id}
            name={item.author.name}
            content={item.content}
            date={new Date(item.createdAt)}
            isOwner={userId !== null && userId === item.author.id}
            onDelete={(id: number) => setDeleteTargetId(id)}
            onEdit={(id: number, content: string) =>
              editComment({ commentId: id, content })
            }
          />
        ))}
      </div>

      <ModalBase
        isOpen={deleteTargetId !== null}
        onOpenChange={() => setDeleteTargetId(null)}
        title="DELETE"
      >
        <div className="flex flex-col gap-8 pt-4">
          <p className="text-lg leading-tight font-bold text-slate-900">
            해당 기록을 영구적으로
            <br />
            삭제하시겠습니까?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteTargetId(null)}
              className="px-6 py-3 text-xs font-black text-slate-400"
            >
              취소
            </button>
            <button
              onClick={handleConfirmDelete}
              className="rounded-xl bg-red-600 px-8 py-3 text-xs font-black text-white shadow-lg shadow-red-600/20"
            >
              삭제
            </button>
          </div>
        </div>
      </ModalBase>
    </section>
  );
}
