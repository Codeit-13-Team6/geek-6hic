"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { BtnCommon } from "@/components/ui/BtnCommon";
import Comment from "./Comment";
import { ToastCommon } from "@/components/ui/ToastCommon";
import { CompactLinkList } from "@/components/features/list/CompactLinkList";
import { extractUrlsFromText } from "@/lib/contentLinkUtils";
import { TextareaCommon } from "@/components/ui/TextareaCommon";
import { CommentSectionProps } from "@/types";
import { DeleteModal } from "@/components/modal/DeleteModal";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import { QUERY_KEYS } from "@/constans/queryKey";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/PaginationCommon";
import {
  useCreateComment,
  useDeleteComment,
  useEditComment,
  useGetComments,
} from "@/hooks/queries/useComments";

const COMMENTS_PAGE_LIMIT = 10;

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis-left",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-right",
    totalPages,
  ] as const;
}

export default function CommentSection({
  postId,
  isThread = false,
}: CommentSectionProps) {
  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);
  const loginGuardAction = useLoginModalStore((s) => s.loginGuardAction);

  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [threadContent, setThreadContent] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const linkObjects = extractUrlsFromText(threadContent);
  const currentOffset = (page - 1) * COMMENTS_PAGE_LIMIT;
  const activeCommentsQueryKey = isThread
    ? QUERY_KEYS.comments.detail(postId)
    : QUERY_KEYS.comments.page(postId, page, COMMENTS_PAGE_LIMIT);

  const { data: comments } = useGetComments({
    postId,
    activeQueryKey: activeCommentsQueryKey,
    isThread,
    offset: currentOffset,
    limit: COMMENTS_PAGE_LIMIT,
  });

  const COMMENT_MAX_LENGTH = 999;
  const commentsList = comments?.data || [];
  const totalCount = comments?.totalCount ?? commentsList.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / COMMENTS_PAGE_LIMIT));
  const visiblePages = getVisiblePages(page, totalPages);

  const { mutate: postComment, isPending: isPosting } =
    useCreateComment(postId);

  const { mutate: removeComment } = useDeleteComment(
    postId,
    activeCommentsQueryKey,
  );
  const { mutate: editComment } = useEditComment(
    postId,
    activeCommentsQueryKey,
  );

  const handlePostComment = () => {
    // 실시간 카드 리스트로 발생하는 렌더링 최적화
    const value = isThread ? threadContent : commentRef.current?.value || "";
    const trimmedValue = value.trim();

    if (!value.trim())
      return ToastCommon({
        message: "내용을 입력해주세요.",
        type: "info",
      });

    if (trimmedValue.length > 999) {
      return ToastCommon({
        message: "댓글은 최대 999자까지 입력 가능합니다.",
        type: "info",
      });
    }

    postComment(value, {
      onSuccess: () => {
        if (!isThread) {
          setPage(1);
          document.getElementById("comments")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          if (commentRef.current) {
            commentRef.current.value = ""; // 일반 댓글창 초기화
          }
        } else {
          setThreadContent(""); // 스레드 입력창 초기화
        }
      },
    });
  };

  const handleEdit = (commentId: number, newContent: string) => {
    editComment({ commentId, content: newContent });
  };

  const handleDelete = (commentId: number) => {
    setDeleteTargetId(commentId);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      removeComment(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <section id="comments" className={"mt-10 flex flex-col gap-6"}>
      {!isThread && (
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold tracking-tighter text-slate-900 sm:text-xl">
            COMMENTS
          </h3>
          <span className="text-main-purple rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-bold">
            {totalCount || 0}
          </span>
        </div>
      )}

      {isThread ? (
        <div className="-mt-10 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <TextareaCommon
              value={threadContent}
              placeholder="메시지나 공유할 링크를 자유롭게 입력해주세요."
              onChange={(event) => setThreadContent(event.target.value)}
              className="focus:!border-main-purple/80 !h-12 !rounded-xl !border-slate-100 !bg-slate-50 focus:!bg-white"
              disabled={isPosting}
              maxLength={1000}
            />
            <div className="flex justify-end">
              <BtnCommon
                className="h-11 w-full !rounded-xl text-sm font-bold sm:w-24"
                onClick={() => loginGuardAction(handlePostComment)}
                disabled={!threadContent.trim() || isPosting}
              >
                {isPosting ? "..." : "작성하기"}
              </BtnCommon>
            </div>
          </div>
          {linkObjects.length > 0 && (
            <>
              <span className="block text-xs font-bold text-slate-300 uppercase">
                링크 미리보기
              </span>
              <div className="rounded-2xl border border-slate-200 bg-white p-2">
                <CompactLinkList links={linkObjects} isPreview={true} />
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="group relative flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 bg-white p-3 transition-colors">
          <textarea
            ref={commentRef}
            rows={2}
            disabled={isPosting}
            placeholder="여기에 댓글을 남겨보세요."
            className="w-full resize-none border-none bg-transparent px-2 pt-2 text-[15px] leading-relaxed text-slate-700 placeholder:text-slate-300 focus:ring-0 focus:outline-none"
            maxLength={1000}
          />
          <div className="flex justify-end">
            <BtnCommon
              onClick={() => loginGuardAction(handlePostComment)}
              disabled={isPosting}
              className="h-10 w-20 !rounded-xl text-sm font-bold"
            >
              등록
            </BtnCommon>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col divide-y divide-slate-200/60">
        {commentsList.map((item) =>
          item.content.split("_")[0] !== "onlyScore" ? (
            <Comment
              key={item.id}
              id={item.id}
              name={item.author.name}
              authorId={item.authorId}
              img={item.author.image}
              content={item.content}
              date={new Date(item.createdAt)}
              isOwner={userId !== null && userId === item.authorId}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onAuthorClick={() => router.push(`/users/${item.authorId}`)}
            />
          ) : (
            <div key={item.id} className="hidden" />
          ),
        )}
      </div>

      {!isThread && totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#comments"
                disabled={page === 1}
                onClick={(event) => {
                  event.preventDefault();
                  if (page > 1) setPage((prev) => prev - 1);
                }}
              />
            </PaginationItem>

            {visiblePages.map((value, index) => (
              <PaginationItem key={`${value}-${index}`}>
                {typeof value === "number" ? (
                  <PaginationLink
                    href="#comments"
                    isActive={value === page}
                    onClick={(event) => {
                      event.preventDefault();
                      setPage(value);
                    }}
                  >
                    {value}
                  </PaginationLink>
                ) : (
                  <PaginationEllipsis />
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#comments"
                disabled={page === totalPages}
                onClick={(event) => {
                  event.preventDefault();
                  if (page < totalPages) setPage((prev) => prev + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <DeleteModal
        isOpen={deleteTargetId !== null}
        onOpenChange={(isOpen) => !isOpen && setDeleteTargetId(null)}
        description="댓글을 삭제하시겠습니까?"
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
