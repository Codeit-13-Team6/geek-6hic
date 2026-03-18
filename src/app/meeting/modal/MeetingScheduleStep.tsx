"use client";

import { Input } from "@/components/shadcnOrigin/input";
import { MeetingScheduleStepProps } from "./modal";

export function MeetingScheduleStep({
  values,
  onChange,
}: MeetingScheduleStepProps) {
  const handleChangeStartDate = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onChange({ startDate: event.target.value });
  };

  const handleChangeStartTime = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onChange({ startTime: event.target.value });
  };

  const handleChangeEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ endDate: event.target.value });
  };

  const handleChangeEndTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ endTime: event.target.value });
  };

  const handleChangeCapacity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value.replace(/[^0-9]/g, "");

    onChange({ capacity: nextValue });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="startDate"
          className="text-foreground text-sm font-medium"
        >
          모임 시작 날짜 <span className="text-green-500">*</span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="startDate"
            type="date"
            value={values.startDate}
            onChange={handleChangeStartDate}
          />

          <Input
            id="startTime"
            type="time"
            value={values.startTime}
            onChange={handleChangeStartTime}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="endDate"
          className="text-foreground text-sm font-medium"
        >
          모집 마감 날짜 <span className="text-green-500">*</span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="endDate"
            type="date"
            value={values.endDate}
            onChange={handleChangeEndDate}
          />

          <Input
            id="endTime"
            type="time"
            value={values.endTime}
            onChange={handleChangeEndTime}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="capacity"
          className="text-foreground text-sm font-medium"
        >
          모임 정원 <span className="text-green-500">*</span>
        </label>

        <Input
          id="capacity"
          type="text"
          inputMode="numeric"
          placeholder="숫자만 입력해주세요"
          value={values.capacity}
          onChange={handleChangeCapacity}
        />
      </div>
    </div>
  );
}
