import { BtnCommon } from "@/components/ui/BtnCommon";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

export function BtnCreatePost() {
  return (
    <Link href="/lounge/create" aria-label="게시글 작성 페이지로 이동">
      <BtnCommon
        className={cn(
          "bg-main-purple fixed right-6 bottom-6 z-99 flex items-center justify-center border border-white/30 text-white shadow-[0_20px_40px_rgba(38,6,86,0.3)] transition-all hover:bg-slate-950 active:scale-95",
          "h-14 w-14 rounded-full sm:h-14 sm:w-[170px] sm:gap-2 sm:rounded-2xl",
          "lg:right-16 lg:bottom-16",
          "group !p-0 sm:!p-6",
        )}
        type="button"
      >
        <Plus
          size={20}
          strokeWidth={3}
          className="transition-transform duration-300 group-hover:rotate-180"
        />
        <span className="hidden text-xs font-black tracking-widest uppercase sm:block">
          게시글 작성
        </span>
      </BtnCommon>
    </Link>
  );
}
