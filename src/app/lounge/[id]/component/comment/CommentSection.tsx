"use client";

import React, { useState } from "react";
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

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
  const [commentValue, setCommentValue] = useState("");

  // 1. 댓글 조회
  const { data: comments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });
  const commentsList = comments?.data || [];

  // 2. 댓글 등록
  const { mutate: postComment, isPending: isPosting } = useMutation({
    mutationFn: (newContent: string) => createComment(postId, newContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setCommentValue("");
    },
    onError: () => {
      ToastCommon({ message: "댓글 등록에 실패했습니다.", size: "sm" });
    },
  });

  // 3. 댓글 삭제
  const { mutate: removeComment } = useMutation({
    mutationFn: (commentId: number) => deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      ToastCommon({ message: "댓글이 삭제되었습니다.", size: "sm" });
    },
    onError: () => {
      ToastCommon({ message: "댓글 삭제에 실패했습니다.", size: "sm" });
    },
  });

  // 4. 댓글 수정
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
    if (!commentValue.trim()) return;
    postComment(commentValue);
  };

  const handleDelete = (commentId: number) => {
    if (confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      removeComment(commentId);
    }
  };

  const handleEdit = (commentId: number, newContent: string) => {
    editComment({ commentId, content: newContent });
  };

  return (
    <section className="flex flex-col gap-4 sm:gap-4">
      <h3 className="text-base font-bold text-gray-800 sm:text-lg lg:text-xl">
        댓글 <span className="text-green-500">{commentsList.length || 0}</span>
      </h3>

      {/* 댓글 입력창 */}
      <div className="relative flex items-center gap-3 rounded-[16px] bg-slate-50 p-2 shadow-sm">
        <textarea
          value={commentValue}
          rows={1}
          disabled={isPosting}
          onChange={(e) => setCommentValue(e.target.value)}
          placeholder={isPosting ? "등록 중..." : "여기에 댓글을 남겨보세요."}
          className="w-full resize-none border-none bg-transparent pl-2 text-gray-700 placeholder:text-gray-300 focus:ring-0 focus:outline-none sm:text-lg"
        />
        <div className="flex justify-end">
          <BtnCommon
            onClick={handlePostComment}
            disabled={isPosting || !commentValue.trim()}
            className="h-[40px] w-[65px] !rounded-[12px] text-sm font-bold sm:h-[50px] sm:w-[70px] sm:text-base"
          >
            등록
          </BtnCommon>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="flex flex-col divide-y divide-slate-200 lg:mt-4">
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
    </section>
  );
}
