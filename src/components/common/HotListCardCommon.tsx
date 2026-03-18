"use client";

import Image from "next/image";
import thumbsUpIcon from "@/assets/icon/thumbsUp/state-false.svg";
import messageIcon from "@/assets/icon/message/message.svg";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRelativeTime } from "@/lib/date";

interface HotListCardCommonProps {
  title?: string;
  date?: string | Date;
  imageSrc?: string | null;
  thumbsUp?: number;
  comment?: number;
  onDetailClick?: () => void;
}

export function HotListCardCommon({
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
        <Image
          src={imageSrc || "/assets/images/default-thumbnail.png"} // 추후 fallback 이미지로 교체
          alt={title}
          className="h-full w-full rounded-[24px] object-cover brightness-60 grayscale dark:brightness-40"
          width={300}
          height={180}
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
