"use client";

import React, { useState } from "react";
import { BtnCommon } from "@/components/ui/BtnCommon";
import { PostDetailCard } from "@/components/features/card/PostDetailCard";
import Comment from "@/components/features/comment/Comment";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPostsDetail } from "@/api/posts";
import { useAuthStore } from "@/store/useAuthStore";
import { createComment, deleteComment, getComments } from "@/api/comments";
import { toastCommon } from "@/lib/toastCommon";

export default function LoungeDetailPage() {
  const { id } = useParams();
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();
  const [commentValue, setCommentValue] = useState("");

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostsDetail(Number(id)),
    enabled: !!id, // id가 있을 때만 실행
  });

  const { data: comments } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => getComments(Number(id)),
    enabled: !!id,
  });

  const commentsList = comments?.data || [];
  const isPostOwner = userId !== null && userId === post?.author.id;

  const { mutate: postComment, isPending: isPosting } = useMutation({
    mutationFn: (newContent: string) => createComment(Number(id), newContent),
    onSuccess: () => {
      // 1. 성공하면 댓글 목록 쿼리를 무효화해서 새로고침 유도
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      setCommentValue("");
    },
    onError: (error) => {
      toastCommon({
        message: "댓글 등록에 실패했습니다. 다시 시도해주세요.",
        size: "sm",
      });
    },
  });

  const handlePostComment = () => {
    if (!commentValue.trim()) return; // 빈 내용 방지
    postComment(commentValue);
  };

  const { mutate: removeComment } = useMutation({
    mutationFn: (commentId: number) => deleteComment(Number(id), commentId),
    onSuccess: () => {
      // 삭제 성공 시 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      toastCommon({
        message: "댓글이 삭제되었습니다.",
        size: "sm",
      });
    },
    onError: () => {
      toastCommon({
        message: "댓글 삭제에 실패했습니다. 다시 시도해주세요.",
        size: "sm",
      });
    },
  });

  const handleDelete = (commentId: number) => {
    if (confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      removeComment(commentId);
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError || !post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  // 1. 본문과 링크 영역 분리
  const parts = post.content.split("<p><a href=");
  const mainContent = parts[0];

  // 2. 쪼개진 문자열들에서 URL과 Title만 추출하여 배열로 만듦
  const linkObjects = parts
    .slice(1)
    .map((str, index) => {
      // 잘려나간 앞부분을 임시로 복원
      const restoredString = "<a href=" + str;

      // 큰따옴표 안에 있는 URL 추출
      const urlMatch = restoredString.match(/href="([^"]+)"/);
      // 이모지부터 </a> 닫는 태그 사이의 진짜 제목 추출
      const titleMatch = restoredString.match(/>🔗\s*(.*?)</);

      return {
        id: `link-${index}`,
        url: urlMatch ? urlMatch[1] : "",
        title: titleMatch ? titleMatch[1].trim() : "참고 링크", // 제목 파싱 실패 시 기본값
        image: "", // 이제 이미지는 안 쓰므로 빈 값 처리
      };
    })
    .filter((link) => link.url); // url이 제대로 뽑힌 정상적인 데이터만 남김 (안전장치)

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 pb-20 sm:p-8 lg:pt-12">
      <div className="mx-auto w-full max-w-[860px]">
        {/* 1. 메인 게시글 카드 */}
        <section className="mb-10">
          <PostDetailCard
            title={post.title}
            name={post.author.name}
            date={new Date(post.createdAt)}
            content={mainContent} // 링크를 제외한 원래 본문 내용만
            linkObjects={linkObjects}
            img={post.image || ""} // 대표 썸네일 (일단 쓰지는 않음)
            thumbsUp={post.likeCount}
            comment={post.comments.length || 0}
            isOwner={isPostOwner}
            liked={post.isLiked}
          />
        </section>

        {/* 2. 댓글 섹션 */}
        <section className="flex flex-col gap-4 sm:gap-4">
          <h3 className="text-base font-bold text-gray-800 sm:text-lg lg:text-xl">
            댓글{" "}
            <span className="text-green-500">{commentsList.length || 0}</span>
          </h3>

          {/* 댓글 입력창 */}
          <div className="relative flex items-center gap-3 rounded-[16px] bg-slate-50 p-2 shadow-sm">
            <textarea
              value={commentValue}
              rows={1}
              disabled={isPosting} // 등록 중에는 입력 방지
              onChange={(e) => setCommentValue(e.target.value)}
              placeholder={
                isPosting ? "등록 중..." : "여기에 댓글을 남겨보세요"
              }
              className="w-full resize-none border-none bg-transparent pl-2 text-gray-700 placeholder:text-gray-300 focus:ring-0 focus:outline-none sm:text-lg"
            />
            <div className="flex justify-end">
              <BtnCommon
                onClick={handlePostComment}
                disabled={isPosting || !commentValue.trim()} // 등록 중이거나 빈 값일 때 버튼 비활성화
                className="h-[40px] w-[65px] !rounded-[12px] text-sm font-bold sm:h-[50px] sm:w-[70px] sm:text-base"
              >
                {isPosting ? "..." : "등록"}
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
              />
            ))}
          </div>

          {/* 3. 페이지네이션 (간이 구현) */}
          <div className="mt-10 flex items-center justify-center gap-4 text-sm font-medium text-gray-400">
            <button className="hover:text-gray-900">{"<"}</button>
            <span className="text-green-500">1</span>
            <button className="hover:text-gray-900">2</button>
            <button className="hover:text-gray-900">3</button>
            <button className="hover:text-gray-900">...</button>
            <button className="hover:text-gray-900">9</button>
            <button className="hover:text-gray-900">{">"}</button>
          </div>
        </section>
      </div>
    </div>
  );
}
