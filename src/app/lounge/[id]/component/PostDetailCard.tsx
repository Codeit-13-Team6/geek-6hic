"use client";

import Image from "next/image";
import parse, { HTMLReactParserOptions, Element } from "html-react-parser";
import meatballsIcon from "@/assets/icon/meatballs/meatballs-xl.svg";
import { Card, CardContent, CardTitle } from "@/components/shadcnOrigin/card";
import profileImg from "@/assets/img/profile/female1-m.jpg";
import thumbsUpIcon from "@/assets/icon/thumbsUp/state-false.svg";
import messageIcon from "@/assets/icon/message/message.svg";
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
import { CompactLinkList } from "@/components/features/list/CompactLinkList";
import { PostDetailCardProps } from "@/types";
import { cn } from "@/lib/utils";
import { HeartIcon } from "@/components/icon/HeartIcon";
import CodeBlock from "./CodeBlock";

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
  // 1. HTML 파싱 옵션 설정
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === "pre") {
        const codeElement = domNode.children.find(
          (child) => child instanceof Element && child.name === "code",
        ) as Element | undefined;

        const targetNode = codeElement
          ? codeElement.children[0]
          : domNode.children[0];
        const codeText = (targetNode as any)?.data || "";

        const className =
          codeElement?.attribs.class || domNode.attribs.class || "";
        const language = className.replace(/language-/, "") || "javascript";

        return <CodeBlock code={codeText} language={language} />;
      }
    },
  };

  const processedContent = content.replace(/<p><\/p>/g, "<p><br/></p>");

  return (
    <Card className="relative overflow-hidden rounded-[32px] border-none bg-white shadow-md shadow-slate-200/30">
      <div className="px-8 pt-10 sm:px-14 lg:px-18 lg:pt-12">
        {isOwner && (
          <div className="absolute top-4 right-4 sm:top-5 sm:right-6 lg:top-6 lg:right-7">
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full p-2 transition-colors hover:bg-slate-50">
                <Image src={meatballsIcon} alt="menu" width={24} height={24} />
              </DropdownMenuTrigger>
              <DropdownMenuContent size="sm">
                <DropdownMenuItem onClick={onEdit}>수정하기</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                  삭제하기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <CardTitle className="mb-6 max-w-[96%] text-2xl leading-tight font-bold tracking-tighter text-slate-900 sm:text-3xl lg:text-4xl">
          {title}
        </CardTitle>

        <div className="mb-3 flex items-center gap-3 text-sm font-medium text-slate-400">
          <div className="relative size-5 overflow-hidden rounded-full bg-slate-100">
            <Image
              src={avatar && profileImg}
              alt="profile"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-slate-500">{name}</span>
          <span className="opacity-20">•</span>
          <time className="text-slate-400">
            {date.toLocaleDateString("ko-KR")}
          </time>
        </div>
      </div>

      <CardContent className="p-8 sm:px-14 lg:px-18 lg:pb-12">
        <div
          className={cn(
            "prose prose-slate max-w-none leading-relaxed text-slate-600",
            "prose-p:my-1",
            "prose-headings:text-slate-900 prose-headings:font-bold prose-headings:mt-5",

            "prose-code:bg-slate-100 prose-code:text-rose-500 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none",

            "prose-pre:prose-code:bg-transparent prose-pre:prose-code:p-0 prose-pre:prose-code:text-inherit",
          )}
        >
          {parse(processedContent, options)}
        </div>

        {linkObjects && linkObjects.length > 0 && (
          <div className="mt-12 border-t border-slate-100 pt-8">
            <h5 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
              <Link2 className="size-3.5" /> 참고 링크
            </h5>
            <div className="opacity-90">
              <CompactLinkList links={linkObjects} />
            </div>
          </div>
        )}

        <div className="mt-12 flex items-center justify-between border-t border-slate-50 pt-6 text-[13px] font-medium text-slate-400">
          <div className="flex items-center gap-5">
            <span>{getRelativeTime(date)}</span>
            <div className="flex items-center gap-3 opacity-60">
              <div className="flex items-center gap-1">
                <Image src={thumbsUpIcon} alt="like" width={16} height={16} />
                <span>{thumbsUp}</span>
              </div>
              <div className="flex items-center gap-1">
                <Image src={messageIcon} alt="comment" width={16} height={16} />
                <span>{comment}</span>
              </div>
            </div>
          </div>

          {!isOwner && (
            <HeartIcon
              liked={isLiked}
              onClick={onLike}
              size={22}
              className="-mr-2"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
