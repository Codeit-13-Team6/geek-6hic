"use client";

import Image from "next/image";
import thumbsUpIcon from "@/assets/icon/thumbsUp/state-false.svg";
import messageIcon from "@/assets/icon/message/message.svg";
import defaultImg from "@/assets/img/empty/img-default.png";

import {
  Card,
  CardAction,
  CardDescription,
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
      className="h-fit w-[162px] shrink-0 cursor-pointer gap-0! rounded-[24px] bg-gray-50 pt-0! pb-0! ring-0! sm:w-[300px]"
      onClick={onDetailClick}
    >
      <section className="relative h-[162px] w-full shrink-0 overflow-hidden rounded-[24px] rounded-b-none">
        <img
          src={imageSrc || defaultImg.src}
          alt={title}
          className="h-full w-full rounded-[24px] rounded-b-none object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImg.src;
          }}
        />
      </section>
      <div className="flex flex-1 flex-col justify-between">
        <CardHeader className="mt-[10px] gap-0 px-[4px] sm:mt-[14px]">
          <CardTitle className="line-clamp-2 w-full text-xl font-semibold">
            {title}
          </CardTitle>
          <CardDescription className="text-sm font-bold text-gray-500"></CardDescription>
        </CardHeader>
        <CardFooter className="flex-row items-start gap-[12px] border-0! px-[4px] pt-0 pt-[6px] pb-[10px] text-sm font-medium sm:pt-[4px]">
          <p className="whitespace-nowrap text-gray-600">
            {getRelativeTime(date)}
          </p>
          <div className="flex flex-row">
            <Image
              src={thumbsUpIcon}
              alt="like"
              width={18}
              height={18}
              className="mr-[2px]"
            />
            <p className="text-sm whitespace-nowrap text-gray-500">
              {thumbsUp}
            </p>
          </div>
          <div className="flex flex-row">
            <Image
              src={messageIcon}
              alt="comment"
              width={18}
              height={18}
              className="mr-[2px]"
            />
            <p className="text-sm whitespace-nowrap text-gray-500">{comment}</p>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
