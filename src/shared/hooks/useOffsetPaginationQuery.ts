"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { OffsetResponse } from "@/shared/types";

interface UseOffsetPaginationQueryParams<T> {
  pageSize: number;
  queryKey: (page: number, pageSize: number) => readonly unknown[];
  queryFn: (params: {
    offset: number;
    limit: number;
  }) => Promise<OffsetResponse<T>>;
  enabled?: boolean;
  staleTime?: number;
  scrollTargetId?: string;
}

export function useOffsetPaginationQuery<T>({
  pageSize,
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 1000 * 60 * 5,
  scrollTargetId,
}: UseOffsetPaginationQueryParams<T>) {
  const [page, setPage] = useState(1);
  const currentOffset = (page - 1) * pageSize;

  const query = useQuery({
    queryKey: queryKey(page, pageSize),
    queryFn: () =>
      queryFn({
        offset: currentOffset,
        limit: pageSize,
      }),
    enabled,
    placeholderData: keepPreviousData,
    staleTime,
  });

  const items = query.data?.data ?? [];
  const totalCount = query.data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handlePageChange = (targetPage: number) => {
    if (targetPage < 1 || targetPage > totalPages) return;
    setPage(targetPage);

    if (scrollTargetId) {
      const targetElement = document.getElementById(scrollTargetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "instant",
          block: "start",
        });
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  };

  return {
    ...query,
    items,
    page,
    totalCount,
    totalPages,
    setPage,
    handlePageChange,
  };
}
