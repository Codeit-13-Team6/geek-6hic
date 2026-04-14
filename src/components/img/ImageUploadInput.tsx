import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import deleteSmIcon from "@/assets/icon/delete/delete-sm.svg";
import deleteLgIcon from "@/assets/icon/delete/delete-lg.svg";
import imagePlusIcon from "@/assets/icon/plus/image-plus.svg";
import FallbackImage from "./FallbackImage";

/**
 * 사용 예시
 *
 * // 1) 컴포넌트 내부에서 직접 업로드 (권장)
 * <ImageUploadInput
 *   type="user"
 *   imageSrc={field.value ?? undefined}
 *   uploadFn={uploadProfileImage}
 *   onUploaded={(url) => field.onChange(url)}
 *   onRemove={() => field.onChange(null)}
 * />
 *
 * // 2) 부모가 직접 File을 받아 처리 (기존 방식, 호환용)
 * <ImageUploadInput
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
        user: "rounded-full",
      },
    },
    defaultVariants: {
      size: "lg",
      type: "image",
    },
  },
);

interface ImageUploadInputProps extends VariantProps<typeof fileInputVariants> {
  imageSrc?: string | null;
  uploadFn?: (file: File) => Promise<string>;
  onUploaded?: (url: string) => void;
  onUploadError?: (err: unknown) => void;
  onFileSelect?: (file: File) => void;
  onRemove?: () => void;
  className?: string;
}

export function ImageUploadInput({
  size = "lg",
  type = "image",
  imageSrc,
  uploadFn,
  onUploaded,
  onUploadError,
  onFileSelect,
  onRemove,
  className,
}: ImageUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const deleteIconPath = size === "sm" ? deleteSmIcon : deleteLgIcon;

  const [isUploading, setIsUploading] = useState(false);

  const shouldShowImage = !!imageSrc || type === "user";

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.currentTarget.value = "";
    if (!file) return;

    if (!uploadFn) {
      onFileSelect?.(file);
      return;
    }

    setIsUploading(true);

    try {
      const publicUrl = await uploadFn(file);
      onUploaded?.(publicUrl);
    } catch (err) {
      console.error("[ImageUpload Error]:", err);
      onUploadError?.(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onRemove?.();
  };

  return (
    <div className="relative w-fit">
      <button
        type="button"
        aria-label="이미지 선택"
        disabled={isUploading}
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

        {shouldShowImage ? (
          <FallbackImage
            src={imageSrc}
            type={type === "user" ? "user" : "post"} // FallbackImage의 타입에 맞게 매핑
            alt="업로드 이미지"
            fill
            className="object-cover"
            unoptimized={!!imageSrc} // Blob URL 최적화 에러 방지
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

        {isUploading && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </button>

      {imageSrc && !isUploading && (
        <button
          type="button"
          aria-label="이미지 삭제"
          onClick={handleRemove}
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
