"use client";

import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import parse, {
  HTMLReactParserOptions,
  Element,
  DOMNode,
} from "html-react-parser";
import meatballsIcon from "@/assets/icon/meatballs/meatballs-xl.svg";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/card";
import thumbsUpIcon from "@/assets/icon/thumbsUp/state-false.svg";
import messageIcon from "@/assets/icon/message/message.svg";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/ui/DropdownCommon";
import { getRelativeTime } from "@/shared/lib/getRelativeTime";
import { Link2 } from "lucide-react";
import { CompactLinkList } from "@/shared/components/features/list/CompactLinkList";
import { PostDetailCardProps } from "@/shared/types";
import { cn } from "@/shared/lib/utils";
import { HeartIcon } from "@/shared/components/icon/HeartIcon";
import { CodeBlock } from "./CodeBlock";
import FallbackImage from "@/shared/components/img/FallbackImage";

export function PostDetailCard({
  title = "제목이 없습니다.",
  date = new Date(),
  name = "익명",
  onAuthorClick,
  content = "본문내용 ",
  linkObjects = [],
  avatar = "",
  thumbsUp = 0,
  comment = 0,
  isLiked = false,
  isOwner = false,
  onEdit,
  onDelete,
  onLike,
}: PostDetailCardProps) {
  const extractText = (node: DOMNode): string => {
    // 텍스트 노드인 경우
    if (node.type === "text") {
      return node.data || "";
    }
    // 태그 노드이고 자식이 있는 경우
    if (node instanceof Element && node.children) {
      return (node.children as DOMNode[])
        .map((child) => extractText(child))
        .join("");
    }
    return "";
  };

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode.type !== "tag") return;

      const element = domNode as Element;

      // 방법 1: <pre> 태그 처리
      if (element.name === "pre") {
        const language = element.attribs["data-language"] || "plain";
        const codeText = extractText(element).trim();
        return <CodeBlock code={codeText} language={language} />;
      }

      // 방법 2: Quill 2.0 컨테이너 (quill 업데이트 시 대비 방어 코드)
      if (element.attribs?.class?.includes("ql-code-block-container")) {
        const language = element.attribs["data-language"] || "typescript";

        const codeText = (element.children as DOMNode[])
          .filter((child) => child.type === "tag") // 줄 단위 div만 필터링
          .map((child) => extractText(child))
          .join("\n")
          .trim();

        return <CodeBlock code={codeText} language={language} />;
      }
    },
  };

  const processedContent = content.replace(/<p><\/p>/g, "<p><br/></p>");
  const cleanContent = DOMPurify.sanitize(processedContent);

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

        <button
          type="button"
          onClick={onAuthorClick}
          className="mb-3 flex items-center gap-3 text-sm font-medium text-slate-400 transition-opacity hover:opacity-80"
        >
          <div className="relative size-5 overflow-hidden rounded-full bg-slate-100">
            <FallbackImage
              src={avatar}
              type="user"
              alt="프로필 이미지"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-slate-500">{name}</span>
          <span className="opacity-20">•</span>
          <time className="text-slate-400">
            {date.toLocaleDateString("ko-KR").slice(0, -1)}
          </time>
        </button>
      </div>

      <CardContent className="p-8 sm:px-14 lg:px-18 lg:pb-12">
        <div
          className={cn(
            "prose prose-slate max-w-none leading-relaxed break-all text-slate-600",
            "prose-p:my-1",
            "prose-headings:text-slate-900 prose-headings:font-bold prose-headings:mt-5",

            "prose-code:bg-slate-100 prose-code:text-rose-500 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none",

            "prose-pre:prose-code:bg-transparent prose-pre:prose-code:p-0 prose-pre:prose-code:text-inherit",
          )}
        >
          {parse(cleanContent, options)}
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
                <Image
                  src={thumbsUpIcon}
                  alt="좋아요 아이콘"
                  width={16}
                  height={16}
                />
                <span>{thumbsUp}</span>
              </div>
              <div className="flex items-center gap-1">
                <Image
                  src={messageIcon}
                  alt="댓글 아이콘"
                  width={16}
                  height={16}
                />
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
