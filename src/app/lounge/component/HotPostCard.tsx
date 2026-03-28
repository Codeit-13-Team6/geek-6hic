"use client";

import Image from "next/image";
import defaultImg from "@/assets/img/empty/img-default.png";
import { cn } from "@/lib/utils";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcnOrigin/card";
import { getRelativeTime } from "@/lib/getRelativeTime";

interface HotPostCardCommonProps {
  title?: string;
  date?: string | Date;
  imageSrc?: string | null;
  thumbsUp?: number;
  comment?: number;
  onDetailClick?: () => void;
}

const LikeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.53l-1.6 7A2 2 0 0 1 18.23 21H7a2 2 0 0 1-2-2V11a2 2 0 0 1 .59-1.41L11.5 4a3.5 3.5 0 0 1 3.5 1.88z" />
  </svg>
);

const MessageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
);

export function HotPostCard({
  title = "제목이 없습니다.",
  date = new Date(),
  imageSrc,
  onDetailClick,
  thumbsUp = 0,
  comment = 0,
}: HotPostCardCommonProps) {
  return (
    <Card
      onClick={onDetailClick}
      className="group w-[180px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white p-0 shadow-none transition-all duration-300 hover:border-[#260656]/30 hover:shadow-[0_12px_24px_-10px_rgba(38,6,86,0.1)] sm:w-[260px] lg:w-[300px]"
    >
      {/* 이미지 구역: 소프트 라운드 */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img
          src={imageSrc || defaultImg.src}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImg.src;
          }}
        />
        {/* 호버 시 나타나는 딥 퍼플 틴트 */}
        <div className="absolute inset-0 bg-[#260656]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="flex flex-col p-4 sm:p-5">
        <CardHeader className="p-0">
          <CardTitle className="line-clamp-2 min-h-[2.8em] text-sm leading-snug font-black tracking-tight text-slate-900 transition-colors group-hover:text-[#260656] sm:text-base lg:text-lg">
            {title}
          </CardTitle>
        </CardHeader>

        <CardFooter className="mt-4 flex items-center justify-between p-0">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            {getRelativeTime(date)}
          </span>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] font-black text-[#260656]">
              <LikeIcon />
              <span>{thumbsUp}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-black text-slate-300">
              <MessageIcon />
              <span>{comment}</span>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
