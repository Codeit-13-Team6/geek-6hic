import { MeetingDescriptionSectionProps } from "@/types";
import { cn } from "@/lib/utils";
import { AlignLeft } from "lucide-react";

export function MeetingDescriptionSection({
  data,
}: MeetingDescriptionSectionProps) {
  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col gap-1 px-2">
        <div className="text-main-purple flex items-center gap-2">
          <AlignLeft size={18} strokeWidth={3} />
          <h2 className="text-xl font-black tracking-tighter text-slate-950 sm:text-2xl">
            모임 설명
          </h2>
        </div>
        <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">
          Archive Description
        </p>
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-[32px] border border-slate-50 bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.03)] shadow-sm",
          "md:p-10 xl:rounded-[40px]",
        )}
      >
        <div className="bg-main-purple/5 absolute -top-10 -right-10 size-40 rounded-full blur-3xl" />

        <div className="relative z-10 text-[15px] leading-[1.8] font-medium whitespace-pre-wrap text-slate-600 sm:text-base sm:leading-[1.9] xl:text-[17px]">
          {data.description}
        </div>
      </div>
    </section>
  );
}
