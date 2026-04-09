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

const fileInputVariants = cva(
  "relative flex flex-col items-center justify-center cursor-pointer overflow-hidden border-none bg-gray-50 transition-all hover:bg-gray-100",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect?.(file);
      e.currentTarget.value = "";
    }
  };

  return (
      <div className="relative w-fit">
        <button
          type="button"
          aria-label="이미지 선택"
          onClick={() => fileInputRef.current?.click()}
          className={cn(fileInputVariants({ size, type }), className)}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          {imageSrc ? (
            <Image
              src={imageSrc}
              alt="미리보기 이미지"
              fill
              className="object-cover"
              // blob URL은 Next Image 최적화 대상이 아니므로 비활성화
              unoptimized
            />
          ) : type === "profile" ? (
            <Image
              src={profileFallbackImg}
              alt="기본 프로필 이미지"
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
                <Image src={imagePlusIcon} alt="이미지 추가 아이콘" fill />
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
        </button>

        {imageSrc && (
          <button
            type="button"
            aria-label="이미지 삭제"
            onClick={onRemove}
            className="absolute top-3 right-3 z-10 flex h-[24px] w-[24px] translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/80 transition-transform active:scale-90"
          >
            <Image
              src={deleteIconPath}
              alt="삭제 아이콘"
              width={16}
              height={16}
            />
          </button>
        )}
      </div>
  );
}
