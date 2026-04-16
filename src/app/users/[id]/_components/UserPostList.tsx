"use client";

import { useRouter } from "next/navigation";
import { getMyPosts, getUserPostsPage } from "@/api/client/posts";
import PostCard from "@/components/features/card/PostCard";
import { useAuthStore } from "@/store/useAuthStore";
import { Post } from "@/types";
import { Loader2, FileText } from "lucide-react";
import { QUERY_KEYS } from "@/constants/queryKey";
import NumberPagination from "@/components/ui/NumberPagination";
import { useOffsetPaginationQuery } from "@/hooks/useOffsetPaginationQuery";
import { UserTabSkeleton } from "@/components/skeleton/UserTabSkeleton";

const MY_POSTS_PAGE_SIZE = 10;

interface UserPostListProps {
  isOwnProfile?: boolean;
  userId?: number;
}

export default function UserPostList({
  isOwnProfile = true,
  userId,
}: UserPostListProps) {
  const router = useRouter();
  //기존에는 user 객체만 가져와서 유저정보 없을때도 api 요청 발생할 수 있음 -> 유저 인증 후에만 가능하도록
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const {
    items: posts,
    isFetching,
    isLoading,
    page,
    totalPages,
    handlePageChange,
  } = useOffsetPaginationQuery({
    pageSize: MY_POSTS_PAGE_SIZE,
    queryKey: (pageNumber, limit) =>
      isOwnProfile
        ? QUERY_KEYS.posts.myPage(pageNumber, limit)
        : QUERY_KEYS.posts.userPage(userId!, pageNumber, limit),
    queryFn: ({ offset, limit }) =>
      isOwnProfile
        ? getMyPosts({ offset, limit }) //쓰레드 글 필터링 된 데이터를 라우터에서 바로 받아옴
        : getUserPostsPage({
            userId: userId!,
            offset,
            limit,
          }),
    enabled: isOwnProfile ? !isAuthLoading : !!userId, //유저 인증 완료된 시점에만 데이터 요청 시작 for 안정성
  });

  if ((isOwnProfile && isAuthLoading) || isLoading) {
    return <UserTabSkeleton variant="post" />;
  }

  if (posts.length === 0 && !isFetching) {
    return (
      <div
        className="flex flex-col items-center justify-center border-t border-slate-100 py-32"
        role="status"
        aria-label="작성한 게시물 없음"
      >
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-slate-50">
          <FileText className="size-10 text-slate-200" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
          {isOwnProfile ? "작성한 게시글이 없어요" : "아직 게시글이 없어요"}
        </h3>
        <p className="mt-2 text-sm font-medium text-slate-400">
          {isOwnProfile
            ? "라운지에 소중한 첫 기록을 남겨보세요."
            : "아직 이 사용자가 작성한 게시물이 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <ul className="grid grid-cols-1 gap-4 sm:gap-6">
        {posts.map((post: Post) => (
          <li
            key={post.id}
            className="group overflow-hidden rounded-[24px] border border-slate-100/50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 sm:hover:-translate-y-1 sm:hover:shadow-[0_20px_40px_rgba(38,6,86,0.08)]"
          >
            <PostCard
              {...post}
              authorName={post.author.name}
              authorId={post.author.id}
              authorImage={post.author.image}
              commentCount={post._count.comments}
              date={new Date(post.createdAt).toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
              })}
              timeAgo={post.createdAt}
              thumbnailUrl={post.image}
              onDetailClick={() => router.push(`/lounge/${post.id}`)}
            />
          </li>
        ))}
      </ul>

      <div
        className="mt-10 flex flex-col items-center gap-4"
        aria-live="polite"
      >
        {isFetching && (
          <div className="flex items-center gap-3">
            <Loader2 className="text-main-purple animate-spin" size={20} />
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
              게시글을 불러오는 중...
            </span>
          </div>
        )}

        <NumberPagination
          href="#"
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
