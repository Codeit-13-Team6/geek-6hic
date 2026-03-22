"use client";

import Image from "next/image";
import meatballsIcon from "@/assets/icon/meatballs/meatballs-lg.svg";
import { Card, CardContent, CardTitle } from "@/components/shadcnOrigin/card";
import profileImg from "@/assets/img/profile/female1-m.jpg";
import thumbsUpIcon from "@/assets/icon/thumbsUp/state-false.svg";
import messageIcon from "@/assets/icon/message/message.svg";
import heartsTrue from "@/assets/icon/hearts/hearts-true.svg";
import heartsFalse from "@/assets/icon/hearts/hearts-false.svg";
import { BtnCommon } from "@/components/ui/BtnCommon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/shadcnOrigin/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownCommon";
import { getRelativeTime } from "@/lib/getRelativeTime";

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
  isOwner?: boolean;
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
  isOwner = false,
}: PostDetailCardProps) {
  const processedContent = content.replace(/<p><\/p>/g, "<p><br/></p>");
  return (
    <Card className="relative rounded-[32px] p-8 sm:p-10 lg:p-14">
      <div className="absolute top-7 right-6 sm:top-10 sm:right-8 lg:top-14 lg:right-12">
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="cursor-pointer">
                <Image
                  src={meatballsIcon}
                  alt="상세보기 아이콘"
                  width={32}
                  height={32}
                />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent size="sm">
              <DropdownMenuItem onClick={() => console.log("수정")}>
                수정하기
              </DropdownMenuItem>

              <DropdownMenuItem
                variant="destructive"
                onClick={() => console.log("삭제")}
              >
                삭제하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <CardTitle className="mb-4 pr-6 text-xl font-bold text-gray-800 sm:mb-5 sm:text-2xl lg:mb-6 lg:text-3xl">
        {title}
      </CardTitle>

      <CardContent className="px-0">
        <div className="relative mb-6 flex items-center gap-2 text-xs text-gray-500 sm:mb-8 sm:text-sm lg:text-base">
          <Image
            className="rounded-full"
            src={avatar && profileImg}
            alt="프로필 이미지"
            width={24}
            height={24}
          />
          <span>{name}</span>
          <span className="text-gray-300">•</span>
          <span>
            {date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}
          </span>
        </div>

        <div
          className="prose prose-slate prose-p:my-0 prose-ul:my-0 prose-ol:my-0 max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />

        {img && (
          <div className="mb-6 w-full max-w-[320px] sm:mb-8">
            <img
              src={img}
              alt="Event cover"
              className="h-full w-full rounded-[20px] object-cover"
            />
          </div>
        )}

        <div className="mt-6 flex items-center justify-between text-xs text-gray-500 sm:mt-8 sm:text-sm lg:text-base">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm sm:text-base">
              {getRelativeTime(date)}
            </span>

            <div className="flex items-center gap-1">
              <Image src={thumbsUpIcon} alt="like" width={16} height={16} />
              <span>{thumbsUp}</span>
            </div>

            <div className="flex items-center gap-1">
              <Image src={messageIcon} alt="comment" width={16} height={16} />
              <span>{comment}</span>
            </div>
          </div>

          {!isOwner && (
            <BtnCommon size="icon-sm" variant="teritary">
              <Image
                src={liked ? heartsTrue : heartsFalse}
                alt="heart"
                width={20}
                height={20}
              />
            </BtnCommon>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
