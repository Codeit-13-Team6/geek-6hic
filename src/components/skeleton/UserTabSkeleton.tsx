"use client";

import { cn } from "@/lib/utils";

interface UserTabSkeletonProps {
  variant?: "meeting" | "post";
}

export function UserTabSkeleton({ variant = "meeting" }: UserTabSkeletonProps) {
  const cardBaseStyle =
    "group relative flex w-full animate-pulse flex-col overflow-hidden border border-slate-100/50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 sm:h-[180px] sm:flex-row sm:items-center sm:gap-8 sm:rounded-[24px] sm:px-8";

  if (variant === "post") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={cardBaseStyle}>
            <div className="relative aspect-video w-full shrink-0 bg-slate-100 sm:aspect-square sm:h-28 sm:w-28 sm:rounded-xl lg:h-32 lg:w-32" />

            <div className="flex h-full flex-1 flex-col justify-between p-5 sm:p-0">
              <div className="space-y-2.5">
                <div className="h-3 w-16 rounded bg-slate-50" />
                <div className="h-7 w-3/4 rounded-lg bg-slate-100" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-slate-50" />
                  <div className="h-4 w-2/3 rounded bg-slate-50" />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="size-5 rounded-full bg-slate-100" />
                  <div className="h-4 w-12 rounded bg-slate-100" />
                </div>
                <div className="flex gap-3.5">
                  <div className="h-4 w-8 rounded bg-slate-50" />
                  <div className="h-4 w-8 rounded bg-slate-50" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={cardBaseStyle}>
          <div className="relative aspect-video w-full shrink-0 bg-slate-100 sm:h-32 sm:w-32 sm:rounded-2xl" />

          <div className="flex flex-1 flex-col justify-center p-6 sm:p-0">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="h-3 w-16 rounded bg-slate-100" />
              <div className="h-6 w-6 rounded-full bg-slate-50" />
            </div>

            <div className="mb-4 h-7 w-2/3 rounded-lg bg-slate-100" />

            <div className="flex items-center gap-6">
              <div className="h-4 w-24 rounded bg-slate-50" />
              <div className="h-4 w-24 rounded bg-slate-50" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
