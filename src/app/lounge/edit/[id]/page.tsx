"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/client-fetcher";

import { getPostsDetail } from "@/api/posts";
import { ToastCommon } from "@/components/ui/ToastCommon";
import { LinkItem, parsePostData } from "@/lib/postUtils";
import LoungePostForm, { PostPayload } from "../../component/LoungePostForm";
import { getOgData } from "@/api/og";

// Form에 넘겨줄 초기 데이터 타입 정의
interface InitialDataType {
  title: string;
  content: string;
  links: LinkItem[];
  image: string;
}

export default function LoungeEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const postId = Number(id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<InitialDataType | null>(null);

  // 1. 기존 게시글 데이터 불러오기
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostsDetail(postId),
    enabled: !!id,
  });

  // 2. 게시글 데이터가 오면 파싱 -> OG api 호출 썸네일 복원 -> initialData 세팅
  useEffect(() => {
    const restoreOgData = async () => {
      if (!post) return;

      // 일단 순수 본문과 링크 배열로 나누기
      const { content: parsedContent, links: parsedLinks } = parsePostData(
        post.content,
      );

      // 파싱된 링크가 없다면 바로 폼 렌더링
      if (parsedLinks.length === 0) {
        setInitialData({
          title: post.title,
          content: parsedContent,
          links: [],
          image: post.image || "",
        });
        return;
      }

      // 파싱된 링크들의 URL로 OG api를 동시에 호출하여 이미지 가져옴
      const restoredLinks = await Promise.all(
        parsedLinks.map(async (link) => {
          try {
            const ogResult = await getOgData(link.url);
            return {
              ...link,
              image: ogResult.image || "", // 썸네일 복원
            };
          } catch (error) {
            console.error(`OG Fetch Failed for ${link.url}`, error);
            // 에러가 나더라도(미지원 사이트 등) 링크 자체가 날아가면 안 되니 기본값 유지
            return link;
          }
        }),
      );

      // OG 데이터까지 복원 완료된 데이터를 폼에 전달
      setInitialData({
        title: post.title,
        content: parsedContent,
        links: restoredLinks,
        image: post.image || "",
      });
    };

    restoreOgData();
  }, [post]);

  // 3. 게시글 수정 로직
  const handleUpdate = async (payload: PostPayload) => {
    setIsSubmitting(true);
    try {
      await axiosInstance.patch(`/posts/${postId}`, payload);

      // 수정 완료 후 상세 페이지 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      ToastCommon({ message: "게시글이 수정되었습니다.", size: "sm" });

      // 성공 시 해당 상세 페이지로 이동
      router.push(`/lounge/${postId}`);
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      ToastCommon({ message: "수정에 실패했습니다.", size: "sm" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !initialData) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <LoungePostForm
      initialData={initialData}
      onSubmit={handleUpdate}
      isSubmitting={isSubmitting}
      submitButtonText="수정"
    />
  );
}
