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
import ModalBase from "@/components/ui/ModalBase";
import { CompactLinkList } from "@/components/features/list/CompactLinkList";
import { extractUrlsFromText } from "@/lib/contentLinkUtils";
import { TextareaCommon } from "@/components/ui/TextareaCommon";
import { CommentSectionProps } from "@/types";

export default function CommentSection({
  postId,
  isThread = false,
}: CommentSectionProps) {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      ToastCommon({ message: "댓글이 삭제되었습니다.", size: "sm" });
    },
    onError: () => {
      ToastCommon({ message: "댓글 삭제에 실패했습니다.", size: "sm" });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      ToastCommon({ message: "댓글이 수정되었습니다.", size: "sm" });
    },
    onError: () => {
      ToastCommon({ message: "댓글 수정에 실패했습니다.", size: "sm" });
    },
  });
  const handlePostComment = () => {
    // 실시간 카드 리스트로 발생하는 렌더링 최적화
    const value = isThread ? threadContent : commentRef.current?.value || "";
    if (!value.trim()) return;

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
    <section className="flex flex-col gap-4 sm:gap-4">
      <h3 className="text-base font-bold text-gray-800 sm:text-lg lg:text-xl">
        {isThread ? "Our Thread" : "댓글"}{" "}
        <span className="text-green-500">{commentsList.length || 0}</span>
      </h3>

      {/* 입력창 분기 처리 */}
      {isThread ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex-1">
              <TextareaCommon
                value={threadContent}
                placeholder="스레드에 남길 메시지나 공유할 링크를 자유롭게 입력해주세요! (URL 입력 시 자동으로 카드가 생성됩니다)"
                onChange={(event) => setThreadContent(event.target.value)}
                className="min-h-[100px] resize-none"
                disabled={isPosting}
              />
            </div>
            <BtnCommon
              className="mt-auto h-[40px] w-full !rounded-[12px] text-sm font-bold sm:h-[50px] sm:w-[65px] sm:w-[70px] sm:text-base"
              onClick={handlePostComment}
              disabled={!threadContent.trim() || isPosting}
            >
              {isPosting ? "작성 중..." : "작성"}
            </BtnCommon>
          </div>
          {linkObjects.length > 0 && (
            <CompactLinkList links={linkObjects} isPreview={true} />
          )}
        </div>
      ) : (
        <div className="relative flex items-center gap-3 rounded-[16px] bg-slate-50 p-2 shadow-sm">
          <textarea
            ref={commentRef}
            rows={1}
            disabled={isPosting}
            placeholder={isPosting ? "등록 중..." : "여기에 댓글을 남겨보세요."}
            className="w-full resize-none border-none bg-transparent pl-2 text-gray-700 placeholder:text-gray-300 focus:ring-0 focus:outline-none sm:text-lg"
          />
          <div className="flex justify-end">
            <BtnCommon
              onClick={handlePostComment}
              disabled={isPosting}
              className="h-[40px] w-[65px] !rounded-[12px] text-sm font-bold sm:h-[50px] sm:w-[70px] sm:text-base"
            >
              등록
            </BtnCommon>
          </div>
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="flex flex-col divide-y divide-slate-200">
        {commentsList.map((item) => (
          <Comment
            key={item.id}
            id={item.id}
            name={item.author.name}
            content={item.content}
            date={new Date(item.createdAt)}
            isOwner={userId !== null && userId === item.author.id}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* 페이지네이션 섹션 */}
      <div className="mt-10 flex items-center justify-center gap-4 text-sm font-medium text-gray-400"></div>

      <ModalBase
        isOpen={deleteTargetId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTargetId(null);
        }}
        title="댓글 삭제"
      >
        <div className="flex flex-col gap-6 pt-4">
          <p className="text-gray-700">댓글을 삭제하시겠습니까?</p>

          <div className="flex justify-end gap-2">
            <BtnCommon
              variant="teritary"
              onClick={() => setDeleteTargetId(null)}
              size="sm"
              className="w-[60px]"
            >
              취소
            </BtnCommon>
            <BtnCommon
              onClick={handleConfirmDelete}
              size="sm"
              className="w-[60px]"
            >
              확인
            </BtnCommon>
          </div>
        </div>
      </ModalBase>
    </section>
  );
}
