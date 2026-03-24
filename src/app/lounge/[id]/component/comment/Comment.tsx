import React, { useState } from "react";
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

interface CommentProps {
  id: number;
  name?: string;
  img?: string;
  date?: Date;
  content?: string;
  isOwner: boolean;
  onDelete: (id: number) => void;
  onEdit: (id: number, newContent: string) => void;
}

export default function Comment({
  id,
  name = "익명",
  img,
  date = new Date(),
  content = "",
  isOwner = false,
  onDelete,
  onEdit,
}: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);

  // 저장 버튼 클릭 시
  const handleSave = () => {
    if (!editValue.trim()) return;
    onEdit(id, editValue); // 부모 컴포넌트의 api 호출 함수 실행
    setIsEditing(false); // 수정 모드 종료
  };

  // 취소 버튼 클릭 시
  const handleCancel = () => {
    setEditValue(content); // 입력하던 내용 원상복구
    setIsEditing(false); // 수정 모드 종료
  };

  return (
    <article className="flex flex-col border-b border-gray-100 py-5 last:border-none sm:py-6">
      {/* 상단: 프로필 정보 + 메뉴 버튼 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
          <Image
            className="shrink-0 rounded-full"
            src={img ?? profileImg}
            alt="프로필 이미지"
            width={24}
            height={24}
          />
          <span className="font-medium text-gray-700">{name}</span>
          <span className="mx-0.5 text-gray-300">•</span>
          <span>
            {date
              .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .slice(0, -1)}
          </span>
        </div>

        {/* 메뉴 버튼 (수정 중이 아닐 때만 노출) */}
        {isOwner && !isEditing && (
          <div className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="cursor-pointer p-1">
                  <Image
                    src={meatballsIcon}
                    alt="상세보기 아이콘"
                    width={24}
                    height={24}
                  />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent size="sm" align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  수정하기
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(id)}
                >
                  삭제하기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* 내용 영역 (일반 모드 vs 수정 모드) */}
      {isEditing ? (
        <div className="mt-3 pl-[32px]">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-gray-700 focus:outline-none sm:text-base"
            rows={3}
            autoFocus
          />
          <div className="mt-2 flex justify-end gap-2 text-sm font-medium">
            <BtnCommon
              onClick={handleCancel}
              size="sm"
              variant="teritary"
              className="w-[50px] sm:w-[60px]"
            >
              취소
            </BtnCommon>
            <BtnCommon
              onClick={handleSave}
              size="sm"
              className="w-[50px] sm:w-[60px]"
              disabled={!editValue.trim() || editValue === content} // 내용이 비었거나 안 바뀌었면 비활성화
            >
              저장
            </BtnCommon>
          </div>
        </div>
      ) : (
        <div className="pt-1.5 pl-[32px] text-sm leading-relaxed whitespace-pre-wrap text-gray-700 sm:text-base">
          {content}
        </div>
      )}
    </article>
  );
}
