"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

function TimePickerCommon() {
  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  )

  const minutes = Array.from({ length: 12 }, (_, i) =>
    String(i * 5).padStart(2, "0")
  )

  const [selectedHour, setSelectedHour] = useState("00")
  const [selectedMinute, setSelectedMinute] = useState("00")

  return (
    <div className="absolute w-40 rounded-xl border p-3">
      <div className="flex">
        <div className="hour w-1/2 mr-1 p-[10px] max-h-[222px] overflow-y-auto custom-scrollbar text-center">
          {hours.map((hour) => {
            const isSelected = selectedHour === hour

            return (
              <button
                key={hour}
                type="button"
                onClick={() => setSelectedHour(hour)}
                className={cn(
                  "hour-item w-full rounded-md py-[6px] px-[10px] font-semibold transition-colors",
                  isSelected
                    ? "bg-green-100 text-green-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {hour}
              </button>
            )
          })}
        </div>

        <div className="minute border-l border-gray-300 w-1/2 p-[10px] max-h-[222px] overflow-y-auto custom-scrollbar text-center">
          {minutes.map((minute) => {
            const isSelected = selectedMinute === minute
            return (
              <button
                key={minute}
                type="button"
                onClick={() => setSelectedMinute(minute)}
                className={cn(
                  "minute-item w-full rounded-md py-[6px] px-[10px] transition-colors font-semibold",
                  isSelected
                    ? "bg-green-100 font-semibold text-green-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {minute}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { TimePickerCommon }