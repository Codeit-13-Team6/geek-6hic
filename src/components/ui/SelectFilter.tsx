"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import filterIcon from "@/assets/icon/filter/filter.svg";

interface FilterOption {
  value: string; // URL에 들어갈 실제 값
  label: string; // 화면에 보일 이름
}

interface SelectFilterProps {
  options: FilterOption[];
  currentValue: string;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
}

export default function SelectFilter({
  options,
  currentValue,
  onValueChange,
  placeholder = "정렬 기준",
}: SelectFilterProps) {
  const currentLabel =
    options.find((opt) => opt.value === currentValue)?.label || placeholder;

  return (
    <Select
      value={currentValue}
      onValueChange={onValueChange}
      aria-label="정렬 기준 선택"
    >
      <SelectTrigger
        showChevron={false}
        aria-label={`정렬 기준: ${currentLabel}`}
        className="h-12 w-auto gap-2 !rounded-xl border-slate-200 px-4 text-[13px] font-bold text-slate-900 sm:h-14"
      >
        <span className="flex size-4 items-center justify-center">
          <span
            aria-hidden
            className="pointer-events-none size-4 bg-gray-600"
            style={{
              WebkitMask: `url(${filterIcon.src}) center / contain no-repeat`,
              mask: `url(${filterIcon.src}) center / contain no-repeat`,
            }}
          />
        </span>
        <SelectValue className="justify-end text-center">{currentLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent
        alignItemWithTrigger={false}
        sideOffset={2}
        align="end"
        className="z-50 min-w-[120px] overflow-hidden rounded-xl border-0 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] outline-none"
      >
        <SelectGroup>
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 outline-none"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
