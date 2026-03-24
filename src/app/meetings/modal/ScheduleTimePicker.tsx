"use client";

import Image from "next/image";

import clockBasicIcon from "@/assets/icon/clock/clock-basic.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcnOrigin/popover";
import { InputCommon } from "@/components/ui/InputCommon";
import { TimePickerCommon } from "@/components/ui/TimePickerCommon";

interface ScheduleTimePickerProps {
  id: string;
  label?: string;
  value: string;
  hintText?: string;
  isRequired?: boolean;
  isDestructive?: boolean;
  onChange: (value: string) => void;
}

export function ScheduleTimePicker({
  id,
  label,
  value,
  hintText,
  isRequired = false,
  isDestructive = false,
  onChange,
}: ScheduleTimePickerProps) {
  return (
    <Popover>
      <div className="relative">
        <InputCommon
          id={id}
          label={label}
          isRequired={isRequired}
          value={value}
          placeholder="00:00"
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
              aria-label="시간 선택"
              className={
                "absolute top-[14px] left-3 flex size-5 items-center justify-center"
              }
            />
          }
        >
          <Image src={clockBasicIcon} alt="" width={20} height={20} />
        </PopoverTrigger>
      </div>

      <PopoverContent className="w-auto border-none bg-transparent p-0 shadow-none">
        {/* 직접 입력도 가능하지만, 같은 형식으로 쉽게 고를 수 있도록 시간 선택기를 함께 제공한다. */}
        <TimePickerCommon value={value} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
}
