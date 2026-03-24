import { useQuery } from "@tanstack/react-query";
import { getPosts, getPostsDetail } from "@/api/posts";
import { getOgData } from "@/api/og";
import { parsePostData } from "@/lib/postUtils";
import { likePost, unlikePost } from "@/api/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, updatePost, deletePost } from "@/api/posts";
import { useRouter } from "next/navigation";
import { ToastCommon } from "@/components/ui/ToastCommon";
import { PostPayload } from "@/app/lounge/component/LoungePostForm";
import { GetPostsParams } from "@/types";

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

/**
 * 게시글 생성 훅 (생성 페이지 전용)
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: PostPayload) => createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      ToastCommon({ message: "게시글이 등록되었습니다.", size: "sm" });
      router.push("/lounge");
    },
    onError: () => {
      ToastCommon({ message: "게시글 등록에 실패했습니다.", size: "sm" });
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
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      ToastCommon({ message: "게시글이 수정되었습니다.", size: "sm" });
      router.push(`/lounge/${postId}`);
    },
    onError: () => {
      ToastCommon({ message: "수정에 실패했습니다.", size: "sm" });
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
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      ToastCommon({ message: "게시글이 삭제되었습니다.", size: "sm" });
      router.push("/lounge");
    },
    onError: () => {
      ToastCommon({ message: "게시글 삭제에 실패했습니다.", size: "sm" });
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
    onMutate: async () => {
      // 낙관적 업데이트
      await queryClient.cancelQueries({ queryKey: ["post", postId] });
      const previousPost = queryClient.getQueryData(["post", postId]);

      queryClient.setQueryData(["post", postId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          isLiked: !oldData.isLiked,
          likeCount: oldData.isLiked
            ? oldData.likeCount - 1
            : oldData.likeCount + 1,
        };
      });
      return { previousPost };
    },
    onError: (_err, _isLiked, context) => {
      queryClient.setQueryData(["post", postId], context?.previousPost);
      ToastCommon({ message: "좋아요 처리에 실패했습니다.", size: "sm" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });
};

/**
 * 포스트 목록 조회 훅
 */
export const useGetPostsList = (
  params: GetPostsParams,
  refetchOnWindowFocus: boolean = true,
) => {
  return useQuery({
    queryKey: ["posts", "list", params],
    queryFn: () => getPosts(params),
    refetchOnWindowFocus,
    staleTime: 1000 * 60 * 1,
  });
};
