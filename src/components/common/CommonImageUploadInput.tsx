import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import deleteSmIcon from "@/assets/icon/delete/delete-sm.svg";
import deleteLgIcon from "@/assets/icon/delete/delete-lg.svg";
import imagePlusIcon from "@/assets/icon/plus/image-plus.svg";

// 1. 스타일 설계도 (CVA): 피그마 디자인에 맞춘 사이즈별(lg, sm) 규격 정의
const fileInputVariants = cva(
  // 공통 스타일: 회색 배경, 포인터 커서, 부드러운 배경색 전환
  "relative flex flex-col items-center justify-center border-none bg-gray-50 cursor-pointer overflow-hidden transition-all hover:bg-gray-100 p-[12px]",
  {
    variants: {
      size: {
        // Large: 데스크탑용 147px 정사각형
        lg: "w-[147px] h-[147px] rounded-[12px]",
        // Small: 모바일용 114px 정사각형
        sm: "w-[114px] h-[114px] rounded-[12px]",
      },
    },
    defaultVariants: { size: "lg" },
  },
);

// 컴포넌트 Props 타입 정의
interface ImageUploadInputProps extends VariantProps<typeof fileInputVariants> {
  imageSrc?: string; // 업로드된 이미지 URL (없으면 업로드 대기 상태)
  onFileSelect?: (file: File) => void; // 파일 선택 시 실행될 콜백
  onRemove?: () => void; // 삭제 버튼 클릭 시 실행될 콜백
  className?: string; // 추가 커스텀 스타일
}

export function CommonImageUploadInput({
  size = "lg",
  imageSrc,
  onFileSelect,
  onRemove,
  className,
}: ImageUploadInputProps) {
  // 실제 파일 선택창(input)을 프로그램적으로 클릭하기 위한 참조
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 사이즈에 따른 삭제(X) 아이콘 이미지 분기 처리
  const deleteIconPath = size === "sm" ? deleteSmIcon : deleteLgIcon;

  return (
    // 업로드 박스 전체 컨테이너
    // 클릭 시 숨겨진 file input을 트리거하여 파일 선택창을 엽니다.
    <div
      className={cn(fileInputVariants({ size }), className)}
      onClick={() => fileInputRef.current?.click()}
    >
      {/* 실제 파일 선택을 담당하는 숨겨진 input */}
      {/* accept="image/*" 로 이미지 파일만 선택 가능하도록 제한 */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileSelect?.(file);
            // 같은 파일을 다시 업로드할 때도 onChange가 발생하도록 value 초기화
            e.currentTarget.value = "";
          }
        }}
      />

      {imageSrc ? (
        // CASE 1: 이미지가 첨부된 상태
        // 업로드된 이미지 미리보기와 삭제 버튼을 표시합니다.
        <>
          {/* 업로드된 이미지 미리보기 */}
          <Image
            src={imageSrc}
            alt="Preview"
            fill
            className="object-cover"
            // 브라우저에서 생성한 blob/object URL 미리보기 이미지는
            // Next Image 최적화 대상이 아니어서 오류를 방지하기 위해 사용합니다.
            unoptimized
          />

          {/* 이미지 삭제 버튼 */}
          <button
            type="button"
            onClick={(e) => {
              // 버튼 클릭이 부모 div로 전달되어 파일 선택창이 열리는 것을 방지
              e.stopPropagation();
              onRemove?.();
            }}
            className="absolute top-[8px] right-[8px] z-10 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-black/80 transition-transform active:scale-90"
          >
            <Image src={deleteIconPath} alt="Delete" width={16} height={16} />
          </button>
        </>
      ) : (
        // CASE 2: 이미지가 없는 상태
        // 업로드 안내 UI(플러스 아이콘 + 텍스트)를 표시합니다.
        <div className="pointer-events-none flex flex-col items-center justify-center gap-[10px]">
          {/* 플러스 아이콘: size(sm/lg)에 따라 크기 변경 */}
          <div
            className={cn(
              "relative",
              size === "sm" ? "h-[24px] w-[24px]" : "h-[32px] w-[32px]",
            )}
          >
            <Image src={imagePlusIcon} alt="Add" fill />
          </div>

          {/* 업로드 안내 텍스트 */}
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
