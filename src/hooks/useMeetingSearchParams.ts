"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import type { SortValue } from "@/types";

export function useMeetingSearchParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabValue = searchParams.get("type") || "";
  const keyword = searchParams.get("keyword") || "";
  const sortBy = (searchParams.get("sortBy") || "dateTime") as SortValue;
  const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      params.delete("page");
      params.delete("cursor");

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const setTabValue = (type: string) =>
    updateParams({
      type,
    });

  const setKeyword = (keyword: string) =>
    updateParams({
      keyword,
    });

  const setSortValue = (value: SortValue) => updateParams({ sortBy: value });

  const setSortOrder = () =>
    updateParams({ sortOrder: sortOrder === "desc" ? "asc" : "desc" });

  const resetFilter = () =>
    updateParams({
      type: null,
      keyword: null,
      sortBy: null,
      sortOrder: null,
    });

  return {
    tabValue,
    keyword,
    sortBy,
    sortOrder,
    setKeyword,
    setTabValue,
    setSortValue,
    setSortOrder,
    resetFilter,
    updateParams,
  };
}
