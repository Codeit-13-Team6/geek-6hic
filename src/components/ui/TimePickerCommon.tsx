"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { TimePickerCommonProps } from "@/types";

function TimePickerCommon({ value, onChange }: TimePickerCommonProps) {
  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0"),
  );

  const minutes = Array.from({ length: 12 }, (_, i) =>
    String(i * 5).padStart(2, "0"),
  );

  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");

  useEffect(() => {
    if (!value) {
      setSelectedHour("00");
      setSelectedMinute("00");
      return;
    }

    const [hour = "00", minute = "00"] = value.split(":");
    setSelectedHour(hour);
    setSelectedMinute(minute);
  }, [value]);

  const handleSelectHour = (hour: string) => {
    setSelectedHour(hour);
    onChange(`${hour}:${selectedMinute}`);
  };

  const handleSelectMinute = (minute: string) => {
    setSelectedMinute(minute);
    onChange(`${selectedHour}:${minute}`);
  };

  return (
    <div className="absolute w-40 rounded-xl border border-gray-100 bg-white p-3">
      <div className="flex">
        <div className="hour custom-scrollbar mr-1 max-h-[222px] w-1/2 overflow-y-auto p-[10px] text-center">
          {hours.map((hour) => {
            const isSelected = selectedHour === hour;

            return (
              <button
                key={hour}
                type="button"
                onClick={() => handleSelectHour(hour)}
                className={cn(
                  "hour-item w-full rounded-md px-[10px] py-[6px] font-semibold transition-colors",
                  isSelected
                    ? "bg-green-100 text-green-600"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                {hour}
              </button>
            );
          })}
        </div>

        <div className="minute custom-scrollbar max-h-[222px] w-1/2 overflow-y-auto border-l border-gray-300 p-[10px] text-center">
          {minutes.map((minute) => {
            const isSelected = selectedMinute === minute;
            return (
              <button
                key={minute}
                type="button"
                onClick={() => handleSelectMinute(minute)}
                className={cn(
                  "minute-item w-full rounded-md px-[10px] py-[6px] font-semibold transition-colors",
                  isSelected
                    ? "bg-green-100 font-semibold text-green-600"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                {minute}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { TimePickerCommon };
