import { Loader2 } from "lucide-react";

export default function HotPostListSkeleton() {
  return (
    <div
      className="flex h-[200px] w-full flex-col items-center justify-center gap-3 rounded-[32px] border border-slate-100 bg-slate-50/50"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="text-main-purple animate-spin" size={24} />
      <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
        인기글을 불러오는 중...
      </span>
    </div>
  );
}
