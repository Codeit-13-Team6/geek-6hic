"use client";

import Image from "next/image";
import meatballsIcon from "@/assets/icon/meatballs/meatballs-lg.svg";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcnOrigin/card";
import profileImg from "@/assets/img/profile/female1-m.jpg";
import thumbsUpIcon from "@/assets/icon/thumbsUp/state-false.svg";
import messageIcon from "@/assets/icon/message/message.svg";
import heartsTrue from "@/assets/icon/hearts/hearts-true.svg";
import heartsFalse from "@/assets/icon/hearts/hearts-false.svg";
import { BtnCommon } from "@/components/ui/BtnCommon";
import { useAuthStore } from "@/store/useAuthStore";

interface PostDetailCardProps {
  title?: string;
  date?: Date;
  name?: string;
  img?: string;
  content?: string;
  avatar?: string;
  thumbsUp?: number;
  comment?: number;
  liked?: boolean;
  authorId?: number;
}

export function PostDetailCard({
  title = "제목이 없습니다.",
  date = new Date(),
  name = "익명",
  img = "https://avatar.vercel.sh/shadcn1",
  content = "본문내용 ",
  avatar = "https://avatar.vercel.sh/shadcn1",
  thumbsUp = 0,
  comment = 0,
  liked = false,
  authorId,
}: PostDetailCardProps) {

  const userId = useAuthStore((state) => state.userId);
  const isOwner = userId !== null && userId === authorId;

  return (
    <Card className="rounded-[48px] p-[64px] ring-0!">
      <CardTitle className="flex flex-row justify-between">
        <h2 className="mb-[20px] text-3xl font-bold text-gray-800">{title}</h2>
        <div className="h-fit cursor-pointer">
          {isOwner ? (
            <Image
              src={meatballsIcon}
              alt="상세보기 아이콘"
              width={40}
              height={40}
              unoptimized
            />
          ) : (
            <BtnCommon size="icon-md" variant="teritary">
              <Image
                src={liked ? heartsTrue : heartsFalse}
                alt="heart"
                width={24}
                height={24}
              />
            </BtnCommon>
          )}
        </div>
      </CardTitle>
      <CardContent className="px-0">
        <div className="mb-[40px] flex flex-row items-center gap-[6px] text-sm text-gray-500">
          <Image
            className="rounded-[24px]"
            src={avatar && profileImg}
            alt="프로필 이미지"
            width={24}
            height={24}
          />
          <p>{name}</p>
          <p>
            {date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}
          </p>
        </div>
        <div className="mb-[32px] text-gray-700">{content}</div>
        {img && (
          <div className="h-[200px] w-[200px]">
            <img
              src={img}
              alt="Event cover"
              className="h-full w-full rounded-[24px] object-cover brightness-60 grayscale dark:brightness-40"
              width={200}
              height={200}
            />
          </div>
        )}

        <div className="pa-0 mt-[40px] flex flex-row items-start gap-[12px] border-0! text-sm font-medium">
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
        </div>
      </CardContent>
    </Card>
  );
}
