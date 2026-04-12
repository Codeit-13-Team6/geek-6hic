import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/api/client";
import { ToastCommon } from "@/components/ui/ToastCommon";
import { QUERY_KEYS } from "@/constans/queryKey";
import { GetCommentsResponse } from "@/types";
import {
  keepPreviousData,
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useOptimisticMutation } from "../useOptimisticUpdate";

// QueryKey(React Query) 의존성이 있어 순수 도메인 모델(comment.ts) 오염을 막기 위해 훅 내부에 선언
export interface UseCommentsListParams {
  postId: number;
  activeQueryKey: QueryKey;
  isThread: boolean;
  offset: number;
  limit: number;
}

export const useGetComments = ({
  postId,
  activeQueryKey,
  isThread,
  offset,
  limit,
}: UseCommentsListParams) => {
  return useQuery({
    queryKey: activeQueryKey,
    queryFn: () =>
      getComments(postId, {
        offset: isThread ? 0 : offset,
        limit: isThread ? 100 : limit,
      }),
    enabled: !!postId,
    placeholderData: isThread ? undefined : keepPreviousData,
  });
};

export const useCreateComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newContent: string) => createComment(postId, newContent),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.comments.detail(postId),
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.posts.list,
        }),
      ]);
    },
    onError: () => {
      ToastCommon({ message: "댓글 등록에 실패했습니다.", size: "sm" });
    },
  });
};

export const useDeleteComment = (
  postId: number,
  activeCommentsQueryKey: QueryKey,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(postId, commentId),
    ...useOptimisticMutation<GetCommentsResponse, number>(queryClient, {
      queryKey: activeCommentsQueryKey,
      updater: (old, commentId) => ({
        ...old,
        data: old.data.filter((c) => c.id !== commentId),
      }),
      invalidateKeys: [
        QUERY_KEYS.comments.detail(postId),
        QUERY_KEYS.posts.list,
      ],
      onErrorMessage: "댓글 삭제에 실패했습니다.",
    }),
    onSuccess: () => {
      ToastCommon({ message: "댓글이 삭제되었습니다.", size: "sm" });
    },
  });
};

export const useEditComment = (
  postId: number,
  activeCommentsQueryKey: QueryKey,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => updateComment(postId, commentId, content),
    ...useOptimisticMutation<
      GetCommentsResponse,
      { commentId: number; content: string }
    >(queryClient, {
      queryKey: activeCommentsQueryKey,
      updater: (old, { commentId, content }) => ({
        ...old,
        data: old.data.map((c) => (c.id === commentId ? { ...c, content } : c)),
      }),
      invalidateKeys: [QUERY_KEYS.comments.detail(postId)],
      onErrorMessage: "댓글 수정에 실패했습니다.",
    }),
    onSuccess: () => {
      ToastCommon({ message: "댓글이 수정되었습니다.", size: "sm" });
    },
  });
};
