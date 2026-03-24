// import { useQuery } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { getPosts } from "@/api/posts";
// import { Posts } from "@/types";
//
// interface UsePostsOptions {
//   filterFn?: (post: Posts) => boolean;
// }
//
// export function usePosts({ filterFn }: UsePostsOptions = {}) {
//   const router = useRouter();
//
//   // 원래는 백엔드측에서 필터걸어서 주는 형식이어야 하지만 프론트쪽에서 제한적으로 적용하는것이기 때문에
//   // 최근 게시물 100개중에서만 나의 게시물 찾아오는 형식으로 제한적 구현
//   const size = filterFn ? 100 : 10;
//
//   const { data: loungeList, isLoading } = useQuery({
//     queryKey: ["posts", size],
//     queryFn: () => getPosts({ size }),
//   });
//
//   // 해당 hook이 라운지쪽과 마이페이지에서 사용하는데 필터링 기준이 각각 달라서 외부에서 주입하는 형식으로 진행
//   const list = filterFn ? loungeList?.filter(filterFn) : loungeList;
//
//   const handleDetailClick = (postId: number) => router.push(`/lounge/${postId}`);
//
//   return { list, isLoading, handleDetailClick };
// }

import { useQuery } from "@tanstack/react-query";
import { getPosts, getPostsDetail } from "@/api/posts";
import { getOgData } from "@/api/og";
import { parsePostData } from "@/lib/postUtils";

/**
 * HOT 게시물 조회 훅 (LoungePage용)
 */
export const useGetHotPosts = () => {
  return useQuery({
    queryKey: ["posts", "best"],
    queryFn: () => getPosts({ type: "best", size: 5 }),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 게시글 상세 조회 훅 (상세 페이지, 수정 페이지용)
 */
export const useGetPostDetail = (postId: number) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostsDetail(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 1,
  });
};

/**
 * 게시글 원본 불러오기 + OG 데이터(썸네일) 복원 (수정 페이지 전용)
 */
export const useGetPostForEdit = (postId: number) => {
  // 1. 포스트 원본 데이터 가져오기
  const { data: post, isLoading: isPostLoading } = useGetPostDetail(postId);

  // 2. 포스트가 도착하면 실행되는 종속 쿼리
  const { data: initialData, isLoading: isOgLoading } = useQuery({
    queryKey: ["post", "edit-og", postId],
    queryFn: async () => {
      if (!post) return null;

      const { content: parsedContent, links: parsedLinks } = parsePostData(
        post.content,
      );

      if (parsedLinks.length === 0) {
        return {
          title: post.title,
          content: parsedContent,
          links: [],
          image: post.image || "",
        };
      }

      // OG api 병렬 호출
      const restoredLinks = await Promise.all(
        parsedLinks.map(async (link) => {
          try {
            const ogResult = await getOgData(link.url);
            return { ...link, image: ogResult.image || "" };
          } catch (error) {
            return link;
          }
        }),
      );

      return {
        title: post.title,
        content: parsedContent,
        links: restoredLinks,
        image: post.image || "",
      };
    },
    enabled: !!post,
    staleTime: 1000 * 60 * 5,
  });

  return {
    initialData,
    post,
    isLoading: isPostLoading || isOgLoading,
  };
};
