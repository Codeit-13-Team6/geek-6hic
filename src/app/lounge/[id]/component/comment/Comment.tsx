"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import profileImg from "@/assets/img/profile/female1-m.jpg";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/shadcnOrigin/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownCommon";
import { extractUrlsFromText } from "@/lib/contentLinkUtils";
import { CompactLinkList } from "@/components/features/list/CompactLinkList";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Comment({
  id,
  name,
  date,
  content,
  isOwner,
  onDelete,
  onEdit,
}: any) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);

  const displayContent = content
    .replace(/(?:https?:\/\/|www\.)[^\s]+/g, "")
    .trim();
  const linkObjects = extractUrlsFromText(content);

  const handleSave = () => {
    if (!editValue.trim()) return;
    onEdit(id, editValue);
    setIsEditing(false);
  };

  return (
    <article className="group relative flex flex-col border-b border-slate-200 py-10 last:border-none sm:py-12">
      <div className="flex items-start justify-between">
        <div className="flex w-full items-start gap-4 sm:gap-6">
          {/* 1. 아바타 영역: 간격을 더 넓혀서 본문과 분리 */}
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white">
            <Image
              src={profileImg}
              alt="프로필"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="flex flex-1 flex-col pt-0.5">
            {/* 2. 상단 정보: 닉네임과 날짜의 가독성 확보 */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base font-black tracking-tight text-slate-950">
                  {name}
                </span>
                <span className="text-[11px] font-bold tracking-widest text-slate-300 uppercase">
                  {date.getFullYear()}.
                  {String(date.getMonth() + 1).padStart(2, "0")}.
                  {String(date.getDate()).padStart(2, "0")}
                </span>
              </div>

              {/* 관리 메뉴: 본문 우측 상단으로 배치 고정 */}
              {isOwner && !isEditing && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-slate-50">
                      <MoreHorizontal className="size-5 text-slate-400" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-2 border-slate-900 bg-white shadow-xl"
                  >
                    <DropdownMenuItem
                      onClick={() => setIsEditing(true)}
                      className="font-bold focus:bg-slate-50"
                    >
                      수정하기
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDelete(id)}
                      className="font-bold focus:bg-red-50 focus:text-red-600"
                    >
                      삭제하기
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* 3. 본문 영역: 왼쪽 쏠림을 방지하기 위해 max-width를 넉넉히 확보 */}
            {isEditing ? (
              <div className="mt-2 w-full max-w-2xl">
                <textarea
                  ref={textareaRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full resize-none rounded-xl border-2 border-slate-100 bg-slate-50 p-4 text-sm font-medium text-slate-700 transition-all outline-none focus:border-[#260656]/30 focus:bg-white"
                  rows={4}
                />
                <div className="mt-3 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditValue(content);
                    }}
                    className="text-[11px] font-black text-slate-400 hover:text-slate-600"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleSave}
                    className="text-[11px] font-black text-[#260656] hover:underline"
                  >
                    SAVE CHANGES
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {displayContent && (
                  <p className="max-w-3xl text-base leading-relaxed whitespace-pre-wrap text-slate-600">
                    {displayContent}
                  </p>
                )}
                {linkObjects.length > 0 && (
                  <div className="mt-2 w-full max-w-xl">
                    <CompactLinkList links={linkObjects} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
