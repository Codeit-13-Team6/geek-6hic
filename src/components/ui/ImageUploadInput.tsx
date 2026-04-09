import { useRef, useState, useEffect, type ChangeEvent } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import deleteSmIcon from "@/assets/icon/delete/delete-sm.svg";
import deleteLgIcon from "@/assets/icon/delete/delete-lg.svg";
import imagePlusIcon from "@/assets/icon/plus/image-plus.svg";
import profileFallbackImg from "@/assets/img/profile/female1-m.jpg";

/**
 * 사용 예시
 *
 * // 1) 컴포넌트 내부에서 직접 업로드 (권장)
 * <ImageUploadInput
 *   type="profile"
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

  // 업로드 진행 중 보여줄 임시 미리보기 (blob URL)
  const [internalPreview, setInternalPreview] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);

  // 표시할 src: 업로드 중엔 미리보기, 평소엔 부모가 준 imageSrc, profile이면 기본 이미지 폴백
  const displaySrc = internalPreview ?? imageSrc;
  const resolvedSrc =
    displaySrc ?? (type === "profile" ? profileFallbackImg : undefined);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.currentTarget.value = "";
    if (!file) return;

    if (!uploadFn) {
      onFileSelect?.(file);
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    setInternalPreview(blobUrl);
    setIsUploading(true);

    try {
      const publicUrl = await uploadFn(file);
      onUploaded?.(publicUrl);
      setInternalPreview(undefined);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("[ImageUpload Error]:", err);
      onUploadError?.(err);
      setInternalPreview(undefined);
      URL.revokeObjectURL(blobUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    if (internalPreview) {
      URL.revokeObjectURL(internalPreview);
      setInternalPreview(undefined);
    }
    onRemove?.();
  };

  useEffect(() => {
    return () => {
      if (internalPreview) URL.revokeObjectURL(internalPreview);
    };
  }, [internalPreview]);

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

        {resolvedSrc ? (
          <Image
            src={resolvedSrc}
            alt="이미지"
            fill
            className="object-cover"
            unoptimized={!!displaySrc}
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

      {displaySrc && !isUploading && (
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
