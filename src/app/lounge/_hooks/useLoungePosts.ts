"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createPost,
  deletePost,
  getHotPosts,
  getPostDetail,
  likePost,
  unlikePost,
  updatePost,
} from "@/api/client/posts";
import { getOgData } from "@/api/client/og";
import { parsePostData } from "@/lib/contentLinkUtils";
import { Toast } from "@/components/ui/Toast";
import { Post, PostPayload } from "@/types";
import { useOptimisticMutation } from "@/hooks/useOptimisticUpdate";
import { QUERY_KEYS } from "@/constants/queryKey";
import { useRouter } from "next/navigation";

export const useGetHotPosts = () => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.posts.hot,
    queryFn: () => getHotPosts(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetPostDetail = (postId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts.detail(postId),
    queryFn: () => getPostDetail(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetPostForEdit = (postId: number) => {
  const { data: post, isLoading: isPostLoading } = useGetPostDetail(postId);

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

      const restoredLinks = await Promise.all(
        parsedLinks.map(async (link) => {
          try {
            const ogResult = await getOgData(link.url);
            return { ...link, image: ogResult.image || "" };
          } catch {
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
