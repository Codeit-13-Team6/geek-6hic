"use client";

import { useMemo, useState } from "react";

import { MeetingDetailData } from "@/app/meetings/[meetingId]/types";
import { BtnCommon } from "@/components/ui/BtnCommon";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/PaginationCommon";
import { TextareaCommon } from "@/components/ui/TextareaCommon";

const PAGE_SIZE = 3;

const formatDate = (value: string) => {
  const date = new Date(value);

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate(),
  ).padStart(2, "0")}`;
};

interface MeetingThreadSectionProps {
  data: MeetingDetailData;
}

export function MeetingThreadSection({ data }: MeetingThreadSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [comment, setComment] = useState("");
  const totalPages = Math.max(1, Math.ceil(data.threads.length / PAGE_SIZE));

  const pagedThreads = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return data.threads.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, data.threads]);

  return (
    <section className="space-y-4">
      <h2 className="text-[24px] font-semibold text-gray-900">모임 스레드</h2>

      <div className="rounded-[24px] border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex gap-3">
          <div className="flex-1">
            <TextareaCommon
              value={comment}
              placeholder="내용을 입력해주세요"
              onChange={(event) => setComment(event.target.value)}
              className="min-h-[54px] resize-none"
            />
          </div>
          <BtnCommon type="button" size="sm" className="mt-auto w-[120px]">
            스레드 작성
          </BtnCommon>
        </div>

        <div className="space-y-0">
          {pagedThreads.map((thread) => (
            <article
              key={thread.id}
              className="border-b border-gray-100 py-6 last:border-b-0 last:pb-0 first:pt-0"
            >
              <div className="mb-2 text-sm text-gray-500">
                {thread.author} · {formatDate(thread.createdAt)}
              </div>
              <p className="text-[15px] leading-[26px] text-gray-700">
                {thread.content}
              </p>
            </article>
          ))}
        </div>

        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                disabled={currentPage === 1}
                onClick={(event) => {
                  event.preventDefault();
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                disabled={currentPage === totalPages}
                onClick={(event) => {
                  event.preventDefault();
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}
