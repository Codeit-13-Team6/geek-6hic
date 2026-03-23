"use client";

import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import Image from "next/image";

import calendarSmIcon from "@/assets/icon/calendar/calendar-sm.svg";
import { Calendar } from "@/components/ui/Calendar";
import { InputCommon } from "@/components/ui/InputCommon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcnOrigin/popover";

interface ScheduleDatePickerProps {
  id: string;
  label: string;
  value: string;
  hintText?: string;
  isRequired?: boolean;
  isDestructive?: boolean;
  min?: string;
  onChange: (value: string) => void;
}

const getParsedDate = (value: string) => {
  if (!value) {
    return undefined;
  }

  const parsedDate = parse(value, "yyyy-MM-dd", new Date());

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate;
};

export function ScheduleDatePicker({
  id,
  label,
  value,
  hintText,
  isRequired = false,
  isDestructive = false,
  min,
  onChange,
}: ScheduleDatePickerProps) {
  const selectedDate = getParsedDate(value);
  const minDate = getParsedDate(min ?? "");
  const selectedDateKey = selectedDate?.getTime() ?? 0;
  const minDateKey = minDate?.getTime() ?? 0;
  const [isOpen, setIsOpen] = useState(false);
  // 캘린더에서 고른 날짜는 적용 버튼을 눌렀을 때만 실제 값으로 반영한다.
  const [draftDate, setDraftDate] = useState<Date | undefined>(selectedDate);
  const [visibleMonth, setVisibleMonth] = useState<Date>(
    selectedDate ?? minDate ?? new Date(),
  );
  let disabledDateMatcher: React.ComponentProps<typeof Calendar>["disabled"];

  // 선택 가능한 시작 날짜 이전은 캘린더에서 비활성화한다.
  if (minDate) {
    disabledDateMatcher = { before: minDate };
  }

  useEffect(() => {
    // 팝오버를 닫으면 임시 선택값은 버리고,
    // 실제 input에 반영된 날짜를 기준으로 다시 선택 상태와 표시 월을 맞춘다.

    if (!isOpen) {
      setDraftDate(selectedDate);
      setVisibleMonth(selectedDate ?? minDate ?? new Date());
    }
  }, [isOpen, minDateKey, selectedDateKey]);

  return (
    <Popover
      open={isOpen}
      onOpenChange={(nextIsOpen) => {
        setIsOpen(nextIsOpen);
      }}
    >
      <div className="relative">
        <InputCommon
          id={id}
          label={label}
          isRequired={isRequired}
          value={value}
          placeholder="YYYY-MM-DD"
          onChange={(event) => {
            onChange(event.target.value);
          }}
          isDestructive={isDestructive}
          hintText={hintText}
          showClearButton={false}
          className="pl-10"
        />

        <PopoverTrigger
          render={
            <button
              type="button"
              aria-label="날짜 선택"
              className="absolute top-[42px] left-3 flex size-5 items-center justify-center"
            />
          }
        >
          <Image src={calendarSmIcon} alt="" width={20} height={20} />
        </PopoverTrigger>
      </div>

      <PopoverContent className="w-auto border-none bg-transparent p-0 shadow-none">
        <Calendar
          mode="single"
          selected={draftDate}
          month={visibleMonth}
          onMonthChange={setVisibleMonth}
          disabled={disabledDateMatcher}
          classNames={{
            today: "text-gray-900 font-normal",
            selected:
              "rounded-(--cell-radius) bg-green-100 text-green-600 font-semibold",
          }}
          onSelect={(date) => {
            setDraftDate(date);
          }}
          onReset={() => {
            setDraftDate(undefined);
          }}
          onApply={() => {
            onChange(draftDate ? format(draftDate, "yyyy-MM-dd") : "");
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
