"use client";

import { ScheduleDatePicker } from "@/app/meetings/modal/ScheduleDatePicker";
import { ScheduleTimePicker } from "@/app/meetings/modal/ScheduleTimePicker";
import { InputCommon } from "@/components/ui/InputCommon";
import { MeetingScheduleStepProps } from "@/types/meeting/meeting-form.props";

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
  const startRowHintText = errors.startDate || errors.startTime;
  const endRowHintText = errors.endDate || errors.endTime;

  const handleChangeCapacity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value.replace(/[^0-9]/g, "");
    onChange({ capacity: nextValue });
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="space-y-[6px]">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <ScheduleDatePicker
              id="startDate"
              label="모임 시작 날짜"
              value={values.startDate}
              min={todayDate}
              isRequired
              isDestructive={Boolean(startRowHintText)}
              onChange={(value) => {
                onChange({ startDate: value });
              }}
            />
          </div>

          <div className="min-w-0 flex-1 pt-[27px]">
            <ScheduleTimePicker
              id="startTime"
              value={values.startTime}
              isDestructive={Boolean(errors.startTime)}
              onChange={(value) => {
                onChange({ startTime: value });
              }}
            />
          </div>
        </div>

        {startRowHintText ? (
          <p className="text-error text-[12px] leading-[16px]">
            {startRowHintText}
          </p>
        ) : null}
      </div>

      <div className="space-y-[6px]">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <ScheduleDatePicker
              id="endDate"
              label="모집 마감 날짜"
              value={values.endDate}
              min={todayDate}
              isRequired
              isDestructive={Boolean(endRowHintText)}
              onChange={(value) => {
                onChange({ endDate: value });
              }}
            />
          </div>

          <div className="min-w-0 flex-1 pt-[27px]">
            <ScheduleTimePicker
              id="endTime"
              value={values.endTime}
              isDestructive={Boolean(errors.endTime)}
              onChange={(value) => {
                onChange({ endTime: value });
              }}
            />
          </div>
        </div>

        {endRowHintText ? (
          <p className="text-error text-[12px] leading-[16px]">
            {endRowHintText}
          </p>
        ) : null}
      </div>

      <InputCommon
        id="capacity"
        type="text"
        inputMode="numeric"
        label="모임 정원"
        isRequired
        placeholder="숫자만 입력해주세요"
        value={values.capacity}
        onChange={handleChangeCapacity}
        onClear={() => {
          onChange({ capacity: "" });
        }}
        isDestructive={Boolean(errors.capacity)}
        hintText={errors.capacity}
      />
    </div>
  );
}
