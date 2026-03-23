import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import deleteSmIcon from "@/assets/icon/delete/delete-sm.svg";
import deleteLgIcon from "@/assets/icon/delete/delete-lg.svg";
import imagePlusIcon from "@/assets/icon/plus/image-plus.svg";
import profileFallbackImg from "@/assets/img/profile/female1-m.jpg";

/**
 * 예시)
 * // 일반 이미지 업로드
 * <ImageUploadInput
 *   type="image"
 *   imageSrc={preview}
 *   onFileSelect={(file) => { ... }}
 *   onRemove={() => setPreview(undefined)}
 * />
 *
 * // 프로필 이미지 업로드 (원형, 기본 프로필 이미지 표시)
 * <ImageUploadInput
 *   type="profile"
 *   imageSrc={preview}
 *   onFileSelect={(file) => { ... }}
 *   onRemove={() => setPreview(undefined)}
 * />
 */

// 공용 이미지 업로드 입력 스타일입니다.
// type variant에 따라 피그마 기준 스타일을 적용합니다.
const fileInputVariants = cva(
  "relative flex flex-col items-center justify-center cursor-pointer overflow-hidden border-none bg-gray-50 p-[12px] transition-all hover:bg-gray-100",
  {
    variants: {
      size: {
        lg: "h-[147px] w-[147px]",
        sm: "h-[114px] w-[114px]",
      },
      type: {
        image: "rounded-[12px]",
        profile: "rounded-full",
      },
    },
    defaultVariants: {
      size: "lg",
      type: "image",
    },
  },
);

interface ImageUploadInputProps extends VariantProps<typeof fileInputVariants> {
  imageSrc?: string;
  onFileSelect?: (file: File) => void;
  onRemove?: () => void;
  className?: string;
}

// 공용 이미지 업로드 컴포넌트입니다.
// 파일 선택, 미리보기, 삭제 기능을 함께 제공합니다.
export function ImageUploadInput({
  size = "lg",
  type = "image",
  imageSrc,
  onFileSelect,
  onRemove,
  className,
}: ImageUploadInputProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const deleteIconPath = size === "sm" ? deleteSmIcon : deleteLgIcon;

  return (
    <div
      className={cn(fileInputVariants({ size, type }), className)}
      onClick={() => fileInputRef.current?.click()}
    >
      {/* 실제 파일 선택 input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileSelect?.(file);
            // 같은 파일을 다시 선택할 수 있도록 value 초기화
            e.currentTarget.value = "";
          }
        }}
      />

      {imageSrc ? (
        <>
          <Image
            src={imageSrc}
            alt="Preview"
            fill
            className="object-cover"
            // blob URL은 Next Image 최적화 대상이 아니므로 비활성화
            unoptimized
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="absolute top-[8px] right-[8px] z-10 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-black/80 transition-transform active:scale-90"
          >
            <Image src={deleteIconPath} alt="Delete" width={16} height={16} />
          </button>
        </>
      ) : type === "profile" ? (
        <Image
          src={profileFallbackImg}
          alt="Default profile"
          fill
          className="object-cover"
        />
      ) : (
        <div className="pointer-events-none flex flex-col items-center justify-center gap-[10px]">
          <div
            className={cn(
              "relative",
              size === "sm" ? "h-[24px] w-[24px]" : "h-[32px] w-[32px]",
            )}
          >
            <Image src={imagePlusIcon} alt="Add image" fill />
          </div>
          <span
            className={cn(
              "font-medium text-gray-500",
              size === "sm" ? "text-[12px]" : "text-[14px]",
            )}
          >
            파일 첨부
          </span>
        </div>
      )}
    </div>
  );
}
