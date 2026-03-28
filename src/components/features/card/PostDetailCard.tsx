"use client";

import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/shadcnOrigin/card";
import profileImg from "@/assets/img/profile/female1-m.jpg";
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
import { Link2, MoreHorizontal } from "lucide-react";
import { CompactLinkList } from "../list/CompactLinkList";
import { cn } from "@/lib/utils";

const HeartIcon = ({ liked }: { liked: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill={liked ? "#260656" : "none"}
    stroke={liked ? "#260656" : "#cbd5e1"}
    strokeWidth="2"
    className="transition-all"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export function PostDetailCard({
  title = "제목이 없습니다.",
  date = new Date(),
  name = "익명",
  content = "",
  linkObjects = [],
  thumbsUp = 0,
  comment = 0,
  liked = false,
  isOwner = false,
  onEdit,
  onDelete,
  onLike,
}: any) {
  const processedContent = content.replace(/<p><\/p>/g, "<p><br/></p>");

  return (
    <Card className="relative overflow-hidden rounded-[2.5rem] border-slate-200 bg-white p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)] sm:p-12 lg:p-16">
      {/* 관리 메뉴 */}
      <div className="absolute top-10 right-8 sm:top-12 sm:right-12">
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 transition-colors hover:bg-slate-100">
                <MoreHorizontal className="size-6 text-slate-400" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl border-2 border-slate-900 bg-white">
              <DropdownMenuItem
                onClick={onEdit}
                className="font-bold focus:bg-slate-100"
              >
                수정하기
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={onDelete}
                className="font-bold focus:bg-red-50 focus:text-red-600"
              >
                삭제하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="mb-10 sm:mb-14">
        <p className="mb-4 text-[10px] font-black tracking-[0.4em] text-[#260656] uppercase">
          Archive / Article
        </p>
        <CardTitle className="text-3xl leading-[1.15] font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
          {title}
        </CardTitle>
      </div>

      <CardContent className="p-0">
        <div className="mb-12 flex items-center gap-4">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-slate-200">
            <Image
              src={profileImg}
              alt="프로필"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-900">{name}</span>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {date.getFullYear()}.
              {String(date.getMonth() + 1).padStart(2, "0")}.
              {String(date.getDate()).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* 본문 에디터 스타일 정돈 */}
        <div
          className="prose prose-slate prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed prose-strong:text-slate-950 prose-code:bg-slate-100 prose-code:text-[#260656] prose-pre:bg-slate-950 prose-pre:rounded-2xl max-w-none text-slate-700"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />

        {/* 참고 링크 섹션 */}
        {linkObjects && linkObjects.length > 0 && (
          <div className="mt-16 rounded-3xl border border-slate-100 bg-slate-50/50 p-6 sm:p-10">
            <h5 className="mb-6 flex items-center gap-3 text-xs font-black tracking-[0.2em] text-[#260656] uppercase">
              <Link2 className="size-4" /> REFERENCES ({linkObjects.length})
            </h5>
            <CompactLinkList links={linkObjects} />
          </div>
        )}

        <div className="mt-16 flex items-center justify-between border-t border-slate-100 pt-10">
          <div className="flex items-center gap-6">
            <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase">
              {getRelativeTime(date)}
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-black text-[#260656]">
                <span className="opacity-50">LIKES</span>
                <span>{thumbsUp}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-black text-slate-400">
                <span className="opacity-50">COMMENTS</span>
                <span>{comment}</span>
              </div>
            </div>
          </div>

          {!isOwner && (
            <button
              onClick={onLike}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl transition-all active:scale-90",
                liked ? "bg-[#260656]/5" : "bg-slate-50 hover:bg-slate-100",
              )}
            >
              <HeartIcon liked={liked} />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
