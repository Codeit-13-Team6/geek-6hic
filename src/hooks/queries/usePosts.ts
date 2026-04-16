import { useInfiniteQuery, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  getHotPosts,
  getLoungePosts,
  getPostDetail,
} from "@/api/client/posts";
import { getOgData } from "@/api/client/og";
import { parsePostData } from "@/lib/contentLinkUtils";
import { likePost, unlikePost } from "@/api/client/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, updatePost, deletePost } from "@/api/client/posts";
import { useRouter } from "next/navigation";
import { Toast } from "@/components/ui/Toast";
import {
  GetPostsResponse,
  LoungeSortBy,
  Post,
  PostPayload,
  SortOrder,
} from "@/types";
import { useOptimisticMutation } from "@/hooks/useOptimisticUpdate";
import { QUERY_KEYS } from "@/constants/queryKey";
import { getNextPageParam } from "@/lib/pagination";

export interface UsePostListParams {
  keyword: string;
  sortBy: LoungeSortBy;
  sortOrder: SortOrder;
}

/**
 * HOT 게시물 조회 훅 (LoungePage용)
 */
export const useGetHotPosts = () => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.posts.hot,
    queryFn: () => getHotPosts(),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 게시글 목록 조회 훅
 */
export const usePostList = (currentParams: UsePostListParams) => {
  return useInfiniteQuery<GetPostsResponse>({
    queryKey: QUERY_KEYS.posts.listParams(currentParams),
    queryFn: ({ pageParam }) => {
      const cursor = typeof pageParam === "string" ? pageParam : undefined;
      return getLoungePosts({
        ...currentParams,
        size: 10,
        ...(cursor ? { cursor } : {}),
      });
    },
    initialPageParam: undefined,
    getNextPageParam,
    staleTime: 1000 * 60,
  });
};

/**
 * 게시글 상세 조회 훅 (상세 페이지, 수정 페이지용)
 */
export const useGetPostDetail = (postId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts.detail(postId),
    queryFn: () => getPostDetail(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
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
    queryKey: [
      ...QUERY_KEYS.posts.detail(postId),
      "edit-og",
      post?.content,
      post?.title,
      post?.image,
    ],
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
        ...post,
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

/**
 * 게시글 생성 훅 (생성 페이지 전용)
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: PostPayload) => createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.root });
      Toast({ message: "게시글이 등록되었습니다.", type: "success" });
      router.push("/lounge");
    },
    onError: () => {
      Toast({ message: "게시글 등록에 실패했습니다.", type: "error" });
    },
  });
};

/**
 * 게시글 수정 훅 (수정 페이지 전용)
 */
export const useUpdatePost = (postId: number) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: PostPayload) => updatePost(postId, payload),
    onSuccess: () => {
      Toast({ message: "게시글이 수정되었습니다.", type: "success" });

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.list });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.posts.detail(postId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.posts.hot,
      });

      router.back();
    },
    onError: () => {
      Toast({ message: "수정에 실패했습니다.", type: "error" });
    },
  });
};

/**
 * 게시글 삭제 훅 (상세 페이지 전용)
 */
export const useDeletePost = (postId: number) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.root });
      Toast({ message: "게시글이 삭제되었습니다.", type: "success" });
      router.push("/lounge");
    },
    onError: () => {
      Toast({ message: "게시글 삭제에 실패했습니다.", type: "error" });
    },
  });
};

/**
 * 게시글 좋아요 토글 훅 (상세 페이지 전용)
 */
export const useToggleLike = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isLiked: boolean) =>
      isLiked ? unlikePost(postId) : likePost(postId),
    ...useOptimisticMutation<Post, boolean>(queryClient, {
      queryKey: QUERY_KEYS.posts.detail(postId),
      updater: (old) => ({
        ...old,
        isLiked: !old.isLiked,
        likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1,
      }),
      invalidateKeys: [QUERY_KEYS.posts.list, QUERY_KEYS.posts.detail(postId)],

      onErrorMessage: "좋아요 처리에 실패했습니다.",
    }),
  });
};
