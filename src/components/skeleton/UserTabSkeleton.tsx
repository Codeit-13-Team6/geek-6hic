import React from "react";

interface UserTabSkeletonProps {
  variant?: "meeting" | "post";
}

export function UserTabSkeleton({ variant = "meeting" }: UserTabSkeletonProps) {
  if (variant === "post") {
    return (
      <div className="flex w-full flex-col gap-4 rounded-[24px] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:gap-8 sm:p-6 md:p-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex animate-pulse flex-col gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0 sm:flex-row sm:pb-8"
          >
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200" />
                <div className="h-4 w-20 rounded bg-gray-200" />
              </div>
              <div className="h-6 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-2/3 rounded bg-gray-200" />
            </div>
            <div className="h-24 w-24 shrink-0 rounded-xl bg-gray-200 sm:h-32 sm:w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="relative animate-pulse overflow-hidden rounded-3xl border border-gray-100 shadow-sm sm:flex sm:items-center sm:gap-5 sm:rounded-[32px] sm:bg-white sm:p-6"
        >
          {/* 이미지 영역 */}
          <div className="h-[156px] w-full shrink-0 bg-gray-200 sm:h-[170px] sm:w-[170px] sm:rounded-3xl" />

          {/* 텍스트 영역 */}
          <div className="flex flex-1 flex-col p-4 sm:p-0">
            <div className="mb-2 h-6 w-2/3 rounded bg-gray-200" />
            <div className="mb-6 h-4 w-1/3 rounded bg-gray-200" />

            <div className="mb-5 flex gap-2">
              <div className="h-6 w-14 rounded-lg bg-gray-200" />
              <div className="h-6 w-14 rounded-lg bg-gray-200" />
            </div>

            <div className="mt-auto flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-gray-200" />
              <div className="h-2 w-full rounded-full bg-gray-200" />
              <div className="h-4 w-10 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
