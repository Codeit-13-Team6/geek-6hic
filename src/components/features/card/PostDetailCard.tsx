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

interface PostDetailCardProps {
  title?: string;
  date?: Date;
  name?: string;
  img?: string;
  linkObjects?: {
    id: string;
    title: string;
    url: string;
  }[];
  content?: string;
  avatar?: string;
  thumbsUp?: number;
  comment?: number;
  liked?: boolean;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onLike?: () => void;
}

export function PostDetailCard({
  title = "제목이 없습니다.",
  date = new Date(),
  name = "익명",
  content = "본문내용 ",
  linkObjects = [],
  avatar = "https://avatar.vercel.sh/shadcn1",
  thumbsUp = 0,
  comment = 0,
  liked = false,
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

            <ul className="flex flex-col gap-2.5">
              {linkObjects.map((link) => {
                // 1. 도메인 추출
                const hostname = link.url
                  ? new URL(link.url).hostname.replace("www.", "")
                  : "";

                // 2. 파비콘 URL 생성
                const faviconUrl = hostname
                  ? `https://favicon.im/${hostname}?larger=true&throw-error-on-404=true`
                  : "";

                return (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition-all hover:border-emerald-200 hover:bg-emerald-50/50"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-colors group-hover:border-emerald-200">
                          {faviconUrl ? (
                            <img
                              src={faviconUrl}
                              alt="링크 미리보기"
                              className="size-5 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling?.setAttribute(
                                  "style",
                                  "display:block",
                                );
                              }}
                            />
                          ) : null}
                          {/* 기본 아이콘 (평소엔 숨겨둠) */}
                          <Link2 className="hidden size-4 text-gray-400" />
                        </div>

                        <span className="truncate text-sm font-medium text-gray-700 group-hover:text-emerald-700">
                          {link.title}
                        </span>
                      </div>

                      {/* 도메인 표시 부분 */}
                      {hostname && (
                        <span className="hidden shrink-0 text-xs text-gray-400 sm:block">
                          {hostname}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
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
