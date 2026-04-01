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
import { Link2 } from "lucide-react";
import { CompactLinkList } from "../list/CompactLinkList";
import { PostDetailCardProps } from "@/types";

export function PostDetailCard({
  title = "제목이 없습니다.",
  date = new Date(),
  name = "익명",
  content = "본문내용 ",
  linkObjects = [],
  avatar = "https://avatar.vercel.sh/shadcn1",
  thumbsUp = 0,
  comment = 0,
  isLiked = false,
  isOwner = false,
  onEdit,
  onDelete,
  onLike,
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
              <DropdownMenuItem onClick={onEdit}>수정하기</DropdownMenuItem>

              <DropdownMenuItem variant="destructive" onClick={onDelete}>
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

        <div // 상세 페이지 뷰어 스타일링
          className="prose prose-slate prose-p:my-0 prose-ul:my-0 prose-ol:my-0 prose-code:before:content-none prose-code:after:content-none prose-code:bg-[#f1f1ef] prose-code:text-red-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-medium prose-code:text-[0.9em] prose-pre:bg-[#f7f6f3] prose-pre:text-[#37352f] prose-pre:border prose-pre:border-[#e9e9e7] prose-pre:rounded-md prose-pre:p-4 prose-h1:my-5 prose-h2:my-3 prose-h3:my-3 max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />

        {linkObjects && linkObjects.length > 0 && (
          <div className="mt-10 border-t border-gray-100 pt-8">
            <h5 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
              <Link2 className="size-4" /> 참고 링크 ({linkObjects.length})
            </h5>

            <CompactLinkList links={linkObjects} />
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
            <BtnCommon onClick={onLike} size="icon-sm" variant="teritary">
              <Image
                src={isLiked ? heartsTrue : heartsFalse}
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
