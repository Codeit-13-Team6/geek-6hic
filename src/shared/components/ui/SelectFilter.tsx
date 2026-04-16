"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/SelectCommon";

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
      <SelectTrigger aria-label={`정렬 기준: ${currentLabel}`}>
        <SelectValue>{currentLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} sideOffset={2} align="end">
        <SelectGroup>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="font-bold">
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
