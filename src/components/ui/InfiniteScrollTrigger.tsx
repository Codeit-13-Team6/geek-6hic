"use client";

import { Loader2 } from "lucide-react";
import React, { forwardRef } from "react";

interface InfiniteScrollTriggerProps {
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  hasData: boolean;
}

const InfiniteScrollTrigger = forwardRef<
  HTMLDivElement,
  InfiniteScrollTriggerProps
>(({ isFetchingNextPage, hasNextPage, hasData }, ref) => {
  return (
    <div
      ref={ref}
      className="mt-10 flex h-40 w-full flex-col items-center justify-center border-t border-slate-50"
    >
      {isFetchingNextPage ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="text-main-purple animate-spin" size={24} />
          <p className="text-main-purple text-[10px] font-black tracking-[0.4em] uppercase">
            목록을 불러오는 중...
          </p>
        </div>
      ) : (
        !hasNextPage &&
        hasData && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-1.5 w-8 rounded-full bg-slate-200" />
            <p className="text-[10px] font-black tracking-[0.3em] text-slate-200 uppercase">
              더 이상 항목이 없습니다
            </p>
          </div>
        )
      )}
    </div>
  );
});

InfiniteScrollTrigger.displayName = "InfiniteScrollTrigger";

export default InfiniteScrollTrigger;
