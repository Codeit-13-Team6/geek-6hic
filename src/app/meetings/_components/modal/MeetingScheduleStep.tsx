"use client";
import { InputCommon } from "@/components/ui/InputCommon";
import { MeetingScheduleStepProps } from "@/types";

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

  const handleChangeCapacity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value.replace(/[^0-9]/g, "");
    onChange({ capacity: nextValue });
  };

  return (
    <div className="space-y-6 pt-6">
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
