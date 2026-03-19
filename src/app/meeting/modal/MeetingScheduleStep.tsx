"use client";

import { Input } from "@/components/shadcnOrigin/input";
import { MeetingScheduleStepProps } from "@/app/meeting/modal/modal";
import { cn } from "@/lib/utils";

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${date}`;
};

export function MeetingScheduleStep({
  values,
  errors,
  onChange,
}: MeetingScheduleStepProps) {
  const todayDate = getTodayDateString();

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
    <div className="space-y-6 pt-6">
      <div className="space-y-2">
        <label
          htmlFor="startDate"
          className="text-foreground text-sm font-medium"
        >
          모임 시작 날짜
          <span
            className={cn(
              "ml-1",
              errors.startDate || errors.startTime
                ? "text-error"
                : "text-green-500",
            )}
          >
            *
          </span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="startDate"
            type="date"
            min={todayDate}
            value={values.startDate}
            onChange={handleChangeStartDate}
            className={cn(errors.startDate && "border-error")}
          />

          <Input
            id="startTime"
            type="time"
            value={values.startTime}
            onChange={handleChangeStartTime}
            className={cn(errors.startTime && "border-error")}
          />
        </div>

        {errors.startDate ? (
          <p className="text-error text-sm">{errors.startDate}</p>
        ) : null}

        {!errors.startDate && errors.startTime ? (
          <p className="text-error text-sm">{errors.startTime}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="endDate"
          className="text-foreground text-sm font-medium"
        >
          모집 마감 날짜
          <span
            className={cn(
              "ml-1",
              errors.endDate || errors.endTime
                ? "text-error"
                : "text-green-500",
            )}
          >
            *
          </span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="endDate"
            type="date"
            min={todayDate}
            value={values.endDate}
            onChange={handleChangeEndDate}
            className={cn(errors.endDate && "border-error")}
          />

          <Input
            id="endTime"
            type="time"
            value={values.endTime}
            onChange={handleChangeEndTime}
            className={cn(errors.endTime && "border-error")}
          />
        </div>

        {errors.endDate ? (
          <p className="text-error text-sm">{errors.endDate}</p>
        ) : null}

        {!errors.endDate && errors.endTime ? (
          <p className="text-error text-sm">{errors.endTime}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="capacity"
          className="text-foreground text-sm font-medium"
        >
          모임 정원
          <span
            className={cn(
              "ml-1",
              errors.capacity ? "text-error" : "text-green-500",
            )}
          >
            *
          </span>
        </label>

        <Input
          id="capacity"
          type="text"
          inputMode="numeric"
          placeholder="숫자만 입력해주세요"
          value={values.capacity}
          onChange={handleChangeCapacity}
          className={cn(errors.capacity && "border-error")}
        />

        {errors.capacity ? (
          <p className="text-error text-sm">{errors.capacity}</p>
        ) : null}
      </div>
    </div>
  );
}
