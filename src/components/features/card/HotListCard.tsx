"use client";

import Image from "next/image";
import thumbsUpIcon from "@/assets/icon/thumbsUp/state-false.svg";
import messageIcon from "@/assets/icon/message/message.svg";
import defaultImg from "@/assets/img/empty/img-default.png";

import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcnOrigin/card";
import { getRelativeTime } from "@/lib/getRelativeTime";

interface HotListCardCommonProps {
  title?: string;
  date?: string | Date;
  imageSrc?: string | null;
  thumbsUp?: number;
  comment?: number;
  onDetailClick?: () => void;
}

export function HotListCard({
  title = "제목이 없습니다.",
  date = new Date(),
  imageSrc,
  onDetailClick,
  thumbsUp = 0,
  comment = 0,
}: HotListCardCommonProps) {
  return (
    <Card
      onClick={onDetailClick}
      className="group w-[160px] shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-white pt-0 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-lg sm:w-[260px] lg:w-[300px]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={imageSrc || defaultImg.src}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImg.src;
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-50" />
      </div>

      <div className="flex flex-col justify-between px-3 sm:px-4">
        <CardHeader className="p-0">
          <CardTitle className="line-clamp-2 min-h-[2.8em] text-sm leading-[1.4] font-semibold tracking-[-0.01em] text-gray-900 sm:text-base lg:text-lg">
            {title}
          </CardTitle>
        </CardHeader>

        <CardFooter className="mt-3 flex items-center justify-between bg-white px-1 py-2 text-xs sm:py-3 sm:text-sm lg:text-base">
          <span className="text-gray-400">{getRelativeTime(date)}</span>

          <div className="flex items-center gap-2 text-gray-500">
            <div className="flex items-center gap-[2px]">
              <Image src={thumbsUpIcon} alt="like" width={14} height={14} />
              <span>{thumbsUp}</span>
            </div>

            <div className="flex items-center gap-[2px]">
              <Image src={messageIcon} alt="comment" width={14} height={14} />
              <span>{comment}</span>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
