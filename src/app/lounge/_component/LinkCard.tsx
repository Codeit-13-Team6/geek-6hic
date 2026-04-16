import React from "react";
import { GripVertical, ImageIcon, Link2, X } from "lucide-react";
import { LinkCardProps } from "@/shared/types";

export default function LinkCard({
  link,
  index,
  isThumbnail,
  isDragging,
  onDragStart,
  onDragOver,
  onDragEnd,
  onSelect,
  onRemove,
}: LinkCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      onClick={() => onSelect(link.image || "")}
      className={`group relative flex cursor-pointer items-center gap-3 rounded-[12px] border p-3 pr-10 transition-all sm:gap-4 sm:p-4 sm:pr-12 ${
        isThumbnail
          ? "border-green-500 bg-green-50 shadow-md"
          : "border-gray-200 bg-gray-50 hover:border-gray-300"
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <GripVertical className="size-5 shrink-0 cursor-grab text-gray-400 group-hover:text-gray-600" />

      <div className="relative flex size-12 shrink-0 items-center justify-center rounded-lg bg-gray-200 sm:size-16">
        <Link2 className="absolute text-gray-400" />
        {link.image && (
          <img
            src={link.image}
            alt="좋아요 아이콘"
            className="z-10 size-12 shrink-0 rounded-lg object-cover sm:size-16"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0";
            }}
          />
        )}
      </div>

      <div className="min-w-0 flex-1 overflow-hidden">
        <h4 className="truncate text-sm font-bold text-gray-900 sm:text-base">
          {link.title}
        </h4>
        <p className="mt-0.5 truncate text-xs text-gray-500 sm:mt-1">
          {link.url}
        </p>
        {isThumbnail && (
          <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-green-600">
            <ImageIcon className="size-3" />
            대표 썸네일
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(link.id);
        }}
        className="absolute top-1/2 right-2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 sm:right-3"
      >
        <X className="size-4 sm:size-5" />
      </button>
    </div>
  );
}
