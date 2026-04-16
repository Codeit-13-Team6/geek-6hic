import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * 예시)
 * <Tag variant="blue" size="lg">오늘 21시 마감</Tag>
 * <Tag variant="white" size="sm">17:30</Tag>
 * <Tag variant="blue" className="font-bold opacity-80">D-Day</Tag>
 */

// 공용 Tag 스타일 정의입니다.
// variant와 size 조합으로 피그마 기준 스타일을 관리합니다.
const tagVariants = cva(
  "group/tag inline-flex shrink-0 items-center justify-center overflow-hidden whitespace-nowrap border font-medium transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        blue: "border-transparent bg-blue-100 text-blue-600",
        white: "border-gray-200 bg-white text-gray-600",
      },
      size: {
        lg: "h-[24px] rounded-[8px] px-2 text-[12px]",
        sm: "h-[20px] rounded-[6px] px-2 text-[11px]",
      },
    },
    defaultVariants: {
      variant: "blue",
      size: "lg",
    },
  },
);

export interface TagProps
  extends useRender.ComponentProps<"span">, VariantProps<typeof tagVariants> {}

// 공용 Tag 컴포넌트입니다.
// 기본은 span으로 렌더링되며, 필요하면 render prop으로 확장할 수 있습니다.
export function Tag({
  className,
  variant = "blue",
  size = "lg",
  render,
  children,
  ...props
}: TagProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(tagVariants({ variant, size }), className),
        children,
      },
      props,
    ),
    render,
    state: {
      slot: "tag",
      variant,
      size,
    },
  });
}

export { tagVariants };
