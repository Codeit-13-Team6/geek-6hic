"use client";

export default function GradeCardSkeleton() {
  return (
    <div className="relative flex h-full min-h-105 w-full flex-col overflow-hidden rounded-4xl bg-[#FDFCFB] p-8 shadow-inner ring-1 ring-black/5">
      <div className="mt-2 space-y-3">
        <div className="h-5 w-3/4 animate-pulse rounded-md bg-slate-200/70" />
        <div className="h-3 w-1/2 animate-pulse rounded-md bg-slate-200/60" />
      </div>

      <div className="my-8 flex flex-1 items-center justify-center">
        <div className="h-36 w-36 animate-pulse rounded-full bg-indigo-100/60" />
      </div>

      <div className="space-y-3">
        <div className="mb-1 h-9 w-40 animate-pulse rounded-full bg-indigo-100/70" />
        <div className="h-3 w-full animate-pulse rounded-md bg-slate-200/60" />
        <div className="h-3 w-5/6 animate-pulse rounded-md bg-slate-200/60" />
      </div>
    </div>
  );
}
