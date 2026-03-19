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
} from "@/components/shadcnOrigin/card";
import { BtnCommon } from "@/components/ui/BtnCommon";

interface UserCardProps {
  title?: string;
  type?: string;
  date?: Date;
  imageSrc?: string;
  participantCount?: number;
  capacity?: number;
  defaultLiked?: boolean;
  showLikeBtn?: boolean;
  onHeartClick?: (liked: boolean) => void;
  onDetailClick?: () => void;
}

export function UserCard({
  title = "제목이 없습니다.",
  type = "유형이 없습니다.",
  date = new Date(),
  imageSrc = "https://avatar.vercel.sh/shadcn1",
  defaultLiked = false,
  participantCount = 0,
  capacity = 20,
  showLikeBtn = true,
  onHeartClick,
  onDetailClick,
}: UserCardProps) {
  const [isLiked, setIsLiked] = useState(defaultLiked);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isLiked;
    setIsLiked(next);
    onHeartClick?.(next);
  };

  const handleDetailClick = () => {
    onDetailClick?.();
  };

  return (
    <Card
      className="mb-[24px] h-[280px] h-fit w-full cursor-pointer gap-0! rounded-[24px] pt-0! pb-0! ring-0! sm:h-[236px] sm:flex-row"
      onClick={handleDetailClick}
    >
      <section className="relative h-[158px] w-full shrink-0 overflow-hidden rounded-t-[24px] rounded-b-none sm:m-6 sm:h-[188px] sm:w-[188px] sm:rounded-[32px]">
        <img
          src={imageSrc}
          alt="Event cover"
          className="h-full w-full object-cover brightness-60 grayscale dark:brightness-40"
        />
        {showLikeBtn && (
          <BtnCommon
            size="icon-md"
            variant="teritary"
            className="absolute top-[16px] right-[16px] sm:hidden"
            onClick={handleHeartClick}
          >
            <Image
              src={isLiked ? heartsTrue : heartsFalse}
              alt="heart"
              width={24}
              height={24}
            />
          </BtnCommon>
        )}
      </section>
      <div className="flex flex-1 flex-col justify-between">
        <CardHeader className="gap-0 p-[16px] pb-[16px] sm:py-[24px]">
          <CardAction>
            <BtnCommon
              size="icon-md"
              variant="teritary"
              className={`hidden sm:mx-[24px] sm:my-[10px] sm:inline-flex ${!showLikeBtn && "invisible"}`}
              onClick={handleHeartClick}
            >
              <Image
                src={isLiked ? heartsTrue : heartsFalse}
                alt="heart"
                width={24}
                height={24}
              />
            </BtnCommon>
          </CardAction>
          <CardTitle className="text-xl font-semibold sm:mt-[13px]">
            {title}
          </CardTitle>
          <CardDescription className="text-sm font-bold text-gray-500">
            {type}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col items-start border-0! bg-white! px-[16px] pt-0 pb-[20px] text-sm font-medium sm:py-[34px]">
          <div className="flex items-center pb-[6px] sm:pb-[10px]">
            <Image
              src={personIcon}
              alt="person"
              width={16}
              height={16}
              className="mr-[2px]"
            />
            <p className="text-sm text-black">
              {participantCount}/{capacity}
            </p>
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
