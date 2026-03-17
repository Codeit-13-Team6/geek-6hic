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

interface HotListCardCommonProps {
  title?: string;
  date?: Date;
  imageSrc?: string;
  thumbsUp?: number
  comment?: number
  onDetailClick?: () => void;
}

export function HotListCardCommon({
  title = "제목이 없습니다.",
  date = new Date(),
  imageSrc = "https://avatar.vercel.sh/shadcn1",
  onDetailClick,
  thumbsUp = 0,
  comment = 0,
}: HotListCardCommonProps) {
  const handleDetailClick = () => {
    onDetailClick?.();
  };

  return (
    <Card
      className="h-fit w-[162px] cursor-pointer gap-0! rounded-[24px] bg-gray-50 pt-0! pb-0! ring-0! sm:w-[300px]"
      onClick={handleDetailClick}
    >
      <section className="relative h-[162px] w-full shrink-0 overflow-hidden rounded-[24px] rounded-b-none sm:h-[180px] sm:w-[300px]">
        <img
          src={imageSrc}
          alt="Event cover"
          className="h-full w-full rounded-[24px] object-cover brightness-60 grayscale dark:brightness-40"
        />
      </section>
      <div className="flex flex-1 flex-col justify-between">
        <CardHeader className="mt-[10px] gap-0 px-[4px] sm:mt-[14px]">
          <CardAction></CardAction>
          <CardTitle className="line-clamp-2 w-full text-xl font-semibold">
            {title}
          </CardTitle>
          <CardDescription className="text-sm font-bold text-gray-500"></CardDescription>
        </CardHeader>
        <CardFooter className="flex-row items-start gap-[12px] border-0! px-[4px] pt-0 pt-[6px] pb-[10px] text-sm font-medium sm:pt-[4px]">
          <p className="whitespace-nowrap text-gray-600">
            {date.toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              hour12: false,
            })}
            간 전
          </p>
          <div className="flex flex-row">
            <Image
              src={thumbsUpIcon}
              alt="thumbsUpIcon"
              width={18}
              height={18}
              className="mr-[2px]"
            />
            <p className="whitespace- text-sm text-gray-500">{thumbsUp}</p>
          </div>

          <div className="flex flex-row">
            <Image
              src={messageIcon}
              alt="messageIcon"
              width={18}
              height={18}
              className="mr-[2px]"
            />
            <p className="whitespace- text-sm text-gray-500">{comment}</p>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
