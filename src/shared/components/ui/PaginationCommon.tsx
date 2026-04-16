import * as React from "react";

import arrowLeft from "@/assets/icon/arrow/arrow-left.svg";
import arrowRight from "@/assets/icon/arrow/arrow-right.svg";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/shadcn/button";
import { MoreHorizontalIcon } from "lucide-react";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationArrowDirection = "left" | "right";

// 페이지 링크 타입
interface PaginationLinkProps
  extends
    Pick<React.ComponentProps<typeof Button>, "size">,
    React.ComponentProps<"a"> {
  // 현재 페이지 여부
  isActive?: boolean;
  // 비활성화 상태 여부
  disabled?: boolean;
}

// 화살표 아이콘 타입
interface PaginationArrowIconProps {
  // 화살표 방향
  direction: PaginationArrowDirection;
  // 비활성화 상태 여부
  disabled?: boolean;
  // 아이콘 크기 스타일
  className?: string;
}

// 이전/다음 버튼 타입
interface PaginationArrowButtonProps extends React.ComponentProps<
  typeof PaginationLink
> {
  // 아이콘 크기 스타일
  iconClassName?: string;
}

// 화살표 모양만 담당하는 아이콘
function PaginationArrowIcon({
  className,
  direction,
  disabled = false,
}: PaginationArrowIconProps) {
  const icon = direction === "left" ? arrowLeft : arrowRight;

  return (
    <span
      aria-hidden
      className={cn(
        "size-6 transition-colors",
        !disabled && "bg-gray-800 group-hover/button:bg-gray-600",
        disabled && "bg-gray-400",
        className,
      )}
      style={{
        WebkitMaskImage: `url(${icon.src})`,
        maskImage: `url(${icon.src})`,
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

// 페이지 링크 UI
function PaginationLink({
  className,
  disabled = false,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      variant="ghost"
      size={size}
      className={cn(
        "bg-transparent text-gray-500 hover:bg-transparent hover:text-gray-600",
        disabled && "pointer-events-none text-gray-300 hover:text-gray-300",
        isActive && "text-main-green-600 hover:text-main-green-600",
        className,
      )}
      nativeButton={false}
      render={
        <a
          aria-current={isActive ? "page" : undefined}
          aria-disabled={disabled || undefined}
          data-slot="pagination-link"
          data-active={isActive}
          tabIndex={disabled ? -1 : props.tabIndex}
          {...props}
        />
      }
    />
  );
}

// 클릭 가능한 이전 페이지 버튼
// 내부에서 PaginationArrowIcon을 불러와 화살표 모양을 넣는다.
function PaginationPrevious({
  className,
  iconClassName,
  ...props
}: PaginationArrowButtonProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("pl-1.5!", className)}
      {...props}
    >
      <PaginationArrowIcon
        direction="left"
        disabled={props.disabled}
        className={iconClassName}
      />
    </PaginationLink>
  );
}

// 클릭 가능한 다음 페이지 버튼
// 내부에서 PaginationArrowIcon을 불러와 화살표 모양을 넣는다.
function PaginationNext({
  className,
  iconClassName,
  ...props
}: PaginationArrowButtonProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("pr-1.5!", className)}
      {...props}
    >
      <PaginationArrowIcon
        direction="right"
        disabled={props.disabled}
        className={iconClassName}
      />
    </PaginationLink>
  );
}

// 페이지 생략 표시 UI
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8 items-center justify-center text-gray-500 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">다음 페이지 더보기</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
