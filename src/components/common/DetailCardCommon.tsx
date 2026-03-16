"use client";

import { useState } from "react";
import Image from "next/image";
import personIcon from "@/assets/icon/person/person.svg";
import heartsTrue from "@/assets/icon/hearts/hearts-true.svg";
import heartsFalse from "@/assets/icon/hearts/hearts-false.svg";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BtnCommon } from "@/components/common/BtnCommon";


interface DetailCardCommonProps {
  title?: string;
  type?: string;
  date?: Date;
  imageSrc?: string;
  defaultLiked?: boolean;
  onHeartClick?: (liked: boolean) => void;
}

export function DetailCardCommon({
  title = "제목이 없습니다.",
  type = "유형이 없습니다.",
  date = new Date(),
  imageSrc = "https://avatar.vercel.sh/shadcn1",
  defaultLiked = false,
  onHeartClick,
}: DetailCardCommonProps) {

  const [liked, setLiked] = useState(defaultLiked);

  const handleHeartClick = () => {
    const next = !liked;
    setLiked(next);
    onHeartClick?.(next);
  };

  return (
    <Card className="w-full rounded-[32px] pt-0! ring-0! gap-0! sm:h-[236px] sm:flex-row mb-[24px]">
      <section className="relative m-6 h-[188px] w-[188px] shrink-0 rounded-[24px]">
        <img
          src={imageSrc}
          alt="Event cover"
          className="h-full w-full rounded-[24px] object-cover brightness-60 grayscale dark:brightness-40"
        />
      </section>
      <div className="flex flex-1 flex-col justify-between">
        <CardHeader className="px-0 py-[24px] gap-0">
          <CardAction>
            <BtnCommon size="icon-md" variant="teritary" className="my-[10px] mx-[24px]" onClick={handleHeartClick}>
              <Image
                src={liked ? heartsTrue : heartsFalse}
                alt="heart"
                width={24}
                height={24}
              />
            </BtnCommon>
          </CardAction>
          <CardTitle className="mt-[13px] text-xl font-semibold">
            {title}
          </CardTitle>
          <CardDescription className="text-sm font-bold text-gray-500">
            {type}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col items-start border-0! bg-white! py-[34px] text-sm font-medium px-0">
          <div className="flex items-center pb-[10px]">
            <Image
              src={personIcon}
              alt="person"
              width={16}
              height={16}
              className="mr-[2px]"
            />
            <p className="text-sm text-black">20/20</p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <p className="pr-[6px] text-gray-500">날짜</p>
            <p className="pr-[10px] text-gray-600">
              {date.toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="pr-[10px] text-gray-300"> | </p>
            <p className="pr-[6px] text-gray-500">시간</p>
            <p className="text-gray-600">
              {date.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
