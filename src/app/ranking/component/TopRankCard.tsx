import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/shadcnOrigin/card";
import profileImg from "@/assets/img/banner/banner-lg.jpg";
import { cn } from "@/lib/utils";

interface TopRankCardProps {
  title?: string;
  point?: number;
  rank?: number;
  meetType?: string;
}

export default function TopRankCard({
  title = "모임 이름이 없습니다.",
  point = 0,
  rank = 0,
  meetType = "스터디",
}: TopRankCardProps) {
  const rankColors: Record<number, string> = {
    1: "bg-[#260656] text-white shadow-[6px_6px_0_rgba(38,6,86,0.3)]",
    2: "bg-slate-200 text-slate-600",
    3: "bg-slate-100 text-slate-500",
  };

  return (
    <Card className="group relative flex h-[160px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-none transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] sm:h-[540px] sm:p-8">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={profileImg}
          alt="배경"
          fill
          className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1d0444] via-[#260656]/30 to-transparent" />
      </div>

      <CardHeader className="relative z-10 flex justify-end p-0">
        <div
          className={cn(
            "flex h-8 w-24 items-center justify-center rounded-xl text-[10px] font-black tracking-widest uppercase sm:h-10 sm:w-32 sm:text-xs",
            rankColors[rank] || "bg-slate-100",
          )}
        >
          {rank}
          {rank === 1 ? "ST" : rank === 2 ? "ND" : "RD"} PLACE
        </div>
      </CardHeader>

      <div className="relative z-10 flex flex-col gap-4">
        <CardContent className="p-0">
          <p className="mb-2 text-[10px] font-black tracking-[0.2em] text-white/70 uppercase">
            {meetType}
          </p>
          <h3 className="line-clamp-2 text-xl leading-tight font-black tracking-tight text-white sm:text-4xl">
            {title}
          </h3>
          <div className="mt-4 flex items-baseline gap-1 text-[#FFD700]">
            <span className="text-2xl font-black sm:text-5xl">
              {point.toLocaleString()}
            </span>
            <span className="text-xs font-bold tracking-widest text-white/60 uppercase">
              PTS
            </span>
          </div>
        </CardContent>

        <CardAction className="w-full">
          <button
            className={cn(
              "w-full rounded-xl py-3 text-[10px] font-black tracking-[0.2em] transition-all active:scale-95 sm:py-5 sm:text-xs",
              rank === 1
                ? "bg-white text-[#260656]"
                : "bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
            )}
          >
            VIEW DETAIL
          </button>
        </CardAction>
      </div>
    </Card>
  );
}
