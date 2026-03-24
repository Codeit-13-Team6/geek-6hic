"use client";

import { PostDetailCard } from "@/components/features/card/PostDetailCard";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost, likePost, unlikePost } from "@/api/posts";
import { useAuthStore } from "@/store/useAuthStore";
import CommentSection from "./component/comment/CommentSection";
import { ToastCommon } from "@/components/ui/ToastCommon";
import { parsePostData } from "@/lib/postUtils";
import { useGetPostDetail } from "@/hooks/usePosts";

export default function LoungeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const postId = Number(id);
  const userId = useAuthStore((state) => state.user?.id);

  const { data: post, isLoading, isError } = useGetPostDetail(postId);

  const isPostOwner = userId !== null && userId === post?.author.id;
  const { content: mainContent, links: linkObjects } = parsePostData(
    post?.content || "",
  );

  const { mutate: removePost } = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      ToastCommon({ message: "게시글이 삭제되었습니다.", size: "sm" });
      router.push("/lounge");
    },
    onError: () => {
      ToastCommon({ message: "게시글 삭제에 실패했습니다.", size: "sm" });
    },
  });

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => (post?.isLiked ? unlikePost(postId) : likePost(postId)),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["post", id] });
      const previousPost = queryClient.getQueryData(["post", id]);
      queryClient.setQueryData(["post", id], (oldData: any) => {
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
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(["post", id], context?.previousPost);
      ToastCommon({ message: "좋아요 실패", size: "sm" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
  });

  const handlePostDelete = () => {
    if (confirm("정말 이 게시글을 삭제하시겠습니까? (복구할 수 없습니다)")) {
      removePost();
    }
  };

  const handlePostEdit = () => {
    router.push(`/lounge/edit/${postId}`);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError || !post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 pb-20 sm:p-8 lg:pt-12">
      <div className="mx-auto w-full max-w-[860px]">
        <section className="mb-10">
          <PostDetailCard
            title={post.title}
            name={post.author.name}
            date={new Date(post.createdAt)}
            content={mainContent} // 링크를 제외한 원래 본문 내용만
            linkObjects={linkObjects}
            thumbsUp={post.likeCount}
            comment={post.comments.length || 0}
            isOwner={isPostOwner}
            liked={post.isLiked}
            onEdit={handlePostEdit}
            onDelete={handlePostDelete}
            onLike={() => toggleLike()}
            // img={post.image || ""} 대표 썸네일 (일단 쓰지는 않음)
          />
        </section>

        <CommentSection postId={postId} />
      </div>
    </div>
  );
}
