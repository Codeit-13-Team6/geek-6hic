import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxCommonProps extends Omit<ComponentProps<"input">, "type"> {
  label: string;
  labelClassName?: string;
  containerClassName?: string;
}

export function CheckboxCommon({
  label,
  labelClassName,
  containerClassName,
  id,
  className,
  checked,
  onChange,
  ...props
}: CheckboxCommonProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <div className={cn("flex items-center gap-2", containerClassName)}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={onChange}
          className={cn(
            "h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-gray-50 transition-all checked:border-main-purple checked:bg-main-purple focus:outline-none focus:ring-2 focus:ring-main-purple focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        {/* 체크 표시 아이콘 (직접 SVG로 구현하거나 체크 시 보이도록 설정) */}
        <svg
          className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: checked ? 1 : 0 }}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <label
        htmlFor={checkboxId}
        className={cn(
          "cursor-pointer text-[14px] font-medium text-gray-800 select-none",
          labelClassName
        )}
      >
        {label}
      </label>
    </div>
  );
}
