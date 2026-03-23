"use client";

import React, { useState } from "react";
import { BtnCommon } from "@/components/ui/BtnCommon";
import { PostDetailCard } from "@/components/features/card/PostDetailCard";
import Comment from "@/components/features/comment/Comment";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPostsDetail } from "@/api/posts";
import { useAuthStore } from "@/store/useAuthStore";

const COMMENTS = [
  {
    id: 1,
    author: {
      name: "ghf",
    },
    content: "comment1",
    createdAt: 20260404,
  },
  {
    id: 2,
    author: {
      name: "ghf",
    },
    content: "comment2",
    createdAt: 23933848,
  },
  {
    id: 3,
    author: {
      name: "ghf",
    },
    content: "comment2",
    createdAt: 23933848,
  },
];
export default function LoungeDetailPage() {
  const { id } = useParams();
  const userId = useAuthStore((state) => state.user?.id);

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

  const isOwner = userId !== null && userId === post?.author.id;

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
            img={post.image || ""} // 대표 썸네일
            thumbsUp={post.likeCount}
            comment={post.comments.length || 0}
            isOwner={isOwner} // 본인인지 상세페이지에서 props로 넘겨주는 것으로 수정
            liked={post.isLiked}
          />
        </section>

        {/* 2. 댓글 섹션 */}
        <section className="flex flex-col gap-4 sm:gap-4">
          <h3 className="text-base font-bold text-gray-800 sm:text-lg lg:text-xl">
            댓글{" "}
            <span className="text-green-500">{post.comments.length || 0}</span>
          </h3>

          {/* 댓글 입력창 */}
          <div className="relative flex items-center gap-3 rounded-[16px] bg-slate-50 p-2 shadow-sm">
            <textarea
              value={commentValue}
              rows={1}
              onChange={(e) => setCommentValue(e.target.value)}
              placeholder="여기에 댓글을 남겨보세요"
              className="w-full resize-none border-none bg-transparent pl-2 text-gray-700 placeholder:text-gray-300 focus:ring-0 focus:outline-none sm:text-lg"
            />
            <div className="flex justify-end">
              <BtnCommon
                onClick={() => console.log("댓글 등록:", commentValue)}
                className="h-[40px] w-[65px] !rounded-[12px] text-sm font-bold sm:h-[50px] sm:w-[80px] sm:text-base lg:h-[60px] lg:text-lg"
              >
                등록
              </BtnCommon>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="flex flex-col divide-y divide-slate-200 lg:mt-4">
            {COMMENTS.map((item) => (
              <Comment
                key={item.id}
                name={item.author.name}
                content={item.content}
                date={new Date(item.createdAt)}
                isOwner={isOwner}
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
