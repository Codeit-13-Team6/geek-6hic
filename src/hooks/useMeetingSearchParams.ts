"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import type { SortBy } from "@/types";
import type { DateRange } from "react-day-picker";

export function useMeetingSearchParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabValue = searchParams.get("type") ?? "";
  const sortBy = (searchParams.get("sortBy") ?? "dateTime") as SortBy;
  const sortOrder = (searchParams.get("sortOrder") ?? "desc") as
    | "asc"
    | "desc";
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const dateRange: DateRange | undefined =
    from && to ? { from: new Date(from), to: new Date(to) } : undefined;

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
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [searchParams, router, pathname],
  );

  const setTabValue = (type: string) =>
    updateParams({
      type,
      sortBy: null,
      sortOrder: null,
      from: null,
      to: null,
    });

  const setSortBy = (value: SortBy) => updateParams({ sortBy: value });

  const setSortOrder = () =>
    updateParams({ sortOrder: sortOrder === "desc" ? "asc" : "desc" });

  const setDateRange = (range: DateRange | undefined) =>
    updateParams({
      from: range?.from?.toISOString().split("T")[0] ?? null,
      to: range?.to?.toISOString().split("T")[0] ?? null,
    });

  const resetFilter = () =>
    updateParams({
      type: null,
      sortBy: null,
      sortOrder: null,
      from: null,
      to: null,
    });

  return {
    tabValue,
    sortBy,
    sortOrder,
    dateRange,
    setTabValue,
    setSortBy,
    setSortOrder,
    setDateRange,
    resetFilter,
  };
}
