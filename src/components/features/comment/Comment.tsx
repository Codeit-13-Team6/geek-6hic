import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import profileImg from "@/assets/img/profile/female1-m.jpg";
import meatballsIcon from "@/assets/icon/meatballs/meatballs-lg.svg";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/shadcnOrigin/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownCommon";
import { BtnCommon } from "@/components/ui/BtnCommon";
import { extractUrlsFromText } from "@/lib/contentLinkUtils";
import { CompactLinkList } from "@/components/features/list/CompactLinkList";
import { CommentProps } from "@/types";
import FallbackImage from "@/components/img/FallbackImage";

export default function Comment({
  id,
  name = "익명",
  authorId,
  img,
  date = new Date(),
  content = "",
  isOwner = false,
  onDelete,
  onEdit,
  onAuthorClick,
}: CommentProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const length = textareaRef.current.value.length;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  // 원본 content에서 url 제거 (스레드 게시물 전용)
  const displayContent = content
    .replace(/(?:https?:\/\/|www\.)[^\s]+/g, "")
    .replace(/\n\s*\n/g, "\n")
    .trim();
  const linkObjects = extractUrlsFromText(content);

  const handleSave = () => {
    if (!editValue.trim()) return;
    onEdit(id, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(content);
    setIsEditing(false);
  };

  return (
    <article className="group flex flex-col py-8 transition-colors first:pt-2">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (authorId) onAuthorClick?.();
          }}
          className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-80"
        >
          <div className="relative size-6 overflow-hidden rounded-full bg-slate-100">
            <FallbackImage
              src={img}
              type="user"
              alt="작성자 프로필 이미지"
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = profileImg.src;
              }}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-[14px] font-bold text-slate-700">{name}</span>
            <div className="flex items-center gap-2">
              <span className="hidden opacity-20 sm:inline">•</span>
              <time className="text-[12px] font-medium text-slate-400">
                {date
                  .toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .replace(/\. /g, ".")
                  .slice(0, -1)}
              </time>
            </div>
          </div>
        </button>

        {isOwner && !isEditing && (
          <div className="">
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer rounded-full p-1 hover:bg-slate-200/80 focus:outline-none">
                <Image
                  src={meatballsIcon}
                  alt="메뉴 아이콘"
                  width={20}
                  height={20}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent size="sm" align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  수정
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(id)}
                >
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mt-4 pl-8">
          <textarea
            ref={textareaRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="focus:border-main-purple focus:ring-black/10 w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-[14px] leading-relaxed text-slate-700 focus:ring-1 focus:outline-none"
            rows={3}
          />
          <div className="mt-3 flex justify-end gap-2">
            <BtnCommon
              onClick={handleCancel}
              size="sm"
              variant="teritary"
              className="h-9 w-16 !rounded-lg text-xs font-bold"
            >
              취소
            </BtnCommon>
            <BtnCommon
              onClick={handleSave}
              size="sm"
              className="h-9 w-16 !rounded-lg text-xs font-bold"
              disabled={!editValue.trim() || editValue === content}
            >
              저장
            </BtnCommon>
          </div>
        </div>
      ) : (
        <div className="mt-2.5 pl-8.5">
          {displayContent && (
            <p className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap text-slate-600 break-all">
              {displayContent}
            </p>
          )}
          {linkObjects.length > 0 && (
            <div className="mt-3 opacity-90">
              <CompactLinkList links={linkObjects} />
            </div>
          )}
        </div>
      )}
    </article>
  );
}
