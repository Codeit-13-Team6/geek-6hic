import Image from "next/image";
import { Card, CardAction, CardContent } from "@/components/shadcnOrigin/card";
import profileImg from "@/assets/img/banner/banner-lg.jpg";

interface RankCardProps {
  title?: string;
  point?: number;
  rank?: number;
  meetType?: string;
  onDetailClick?: () => void;
}

export default function RankCard({
  title = "모임 이름이 없습니다.",
  point = 0,
  rank = 0,
  meetType = "스터디",
  onDetailClick = () => {},
}: RankCardProps) {
  return (
    <Card className="flex flex-row items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:border-[#260656]/30 hover:shadow-[0_12px_24px_-10px_rgba(38,6,86,0.1)] sm:h-24 sm:px-8">
      <CardContent className="flex min-w-0 items-center gap-6 p-0 sm:gap-10">
        <span className="text-lg font-black tracking-tighter text-[#260656] italic sm:text-2xl">
          {rank.toString().padStart(2, "0")}
        </span>

        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-100 sm:h-16 sm:w-16 sm:rounded-2xl">
          <Image
            src={profileImg}
            alt="썸네일"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="flex min-w-0 flex-col">
          <h3 className="truncate text-base font-black tracking-tight text-slate-950 sm:text-xl">
            {title}
          </h3>
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            {meetType}
          </p>
        </div>
      </CardContent>

      <CardAction className="flex items-center gap-6 p-0">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-black text-[#260656] sm:text-2xl">
            {point.toLocaleString()}
          </span>
          <span className="text-[10px] font-bold text-slate-300 uppercase">
            PTS
          </span>
        </div>
        <button
          onClick={onDetailClick}
          className="hidden rounded-xl bg-slate-50 px-6 py-3 text-[10px] font-black tracking-widest text-slate-500 transition-all hover:bg-[#260656] hover:text-white sm:block"
        >
          DETAIL
        </button>
      </CardAction>
    </Card>
  );
}
