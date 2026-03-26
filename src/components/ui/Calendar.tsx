"use client";

import * as React from "react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker";
import Image from "next/image";
import ArrowLeft from "@/assets/icon/arrow/arrow-left.svg";
import ArrowRight from "@/assets/icon/arrow/arrow-right.svg";
import ArrowDown from "@/assets/icon/arrow/arrow-down.svg";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/shadcnOrigin/button";
import { BtnCommon } from "@/components/ui/BtnCommon";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  onReset,
  onApply,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  onReset?: () => void;
  onApply?: () => void;
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
      <div className="z-20 absolute lg:top-full lg:-left-60 left-0 -translate-x-1/2 lg:translate-x-0 box-border w-[300px] rounded-[12px] border border-gray-100 bg-white p-6 shadow-[0_10px_10px_-5px_rgba(0,0,0,0.04)]">
        <DayPicker
          showOutsideDays={showOutsideDays}
          className={cn(
            "group/calendar bg-background [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
            String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
            String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
            className,
          )}
          captionLayout={captionLayout}
          locale={ko}
          formatters={{
            formatMonthDropdown: (date) =>
              date.toLocaleString(locale?.code, { month: "short" }),
            ...formatters,
          }}
          classNames={{
            root: cn("w-fit", defaultClassNames.root),
            months: cn(
              "relative flex flex-col gap-4 md:flex-row",
              defaultClassNames.months,
            ),
            month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
            nav: cn(
              "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
              defaultClassNames.nav,
            ),
            button_previous: cn(
              buttonVariants({ variant: buttonVariant }),
              "size-(--cell-size) cursor-pointer p-0 select-none aria-disabled:opacity-50",
              defaultClassNames.button_previous,
            ),
            button_next: cn(
              buttonVariants({ variant: buttonVariant }),
              "size-(--cell-size) cursor-pointer p-0 select-none aria-disabled:opacity-50",
              defaultClassNames.button_next,
            ),
            month_caption: cn(
              "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
              defaultClassNames.month_caption,
            ),
            dropdowns: cn(
              "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
              defaultClassNames.dropdowns,
            ),
            dropdown_root: cn(
              "relative rounded-(--cell-radius)",
              defaultClassNames.dropdown_root,
            ),
            dropdown: cn(
              "bg-popover absolute inset-0 opacity-0",
              defaultClassNames.dropdown,
            ),
            caption_label: cn(
              "font-medium select-none",
              captionLayout === "label"
                ? "text-sm font-semibold text-gray-800"
                : "[&>svg]:text-muted-foreground flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5",
              defaultClassNames.caption_label,
            ),
            table: "w-full border-collapse",
            weekdays: cn("flex", defaultClassNames.weekdays),
            weekday: cn(
              "flex-1 rounded-(--cell-radius) text-sm font-semibold text-gray-600 select-none",
              defaultClassNames.weekday,
            ),
            week: cn("mt-2 flex w-full", defaultClassNames.week),
            week_number_header: cn(
              "w-(--cell-size) select-none",
              defaultClassNames.week_number_header,
            ),
            week_number: cn(
              "text-muted-foreground text-[0.8rem] select-none",
              defaultClassNames.week_number,
            ),
            day: cn(
              "group/day relative rounded-(--cell-radius) text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
              props.showWeekNumber
                ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
                : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
              defaultClassNames.day,
            ),
            range_start: cn(
              "bg-muted after:bg-muted relative isolate z-0 rounded-l-(--cell-radius) after:absolute after:inset-y-0 after:right-0 after:w-4",
              defaultClassNames.range_start,
            ),
            range_middle: cn("rounded-none", defaultClassNames.range_middle),
            range_end: cn(
              "bg-muted after:bg-muted relative isolate z-0 rounded-r-(--cell-radius) after:absolute after:inset-y-0 after:left-0 after:w-4",
              defaultClassNames.range_end,
            ),
            today: cn(
              "rounded-(--cell-radius) font-semibold text-green-600 data-[selected=true]:rounded-none",
              defaultClassNames.today,
            ),
            outside: cn(
              "aria-selected:text-muted-foreground pointer-events-none text-gray-400",
              defaultClassNames.outside,
            ),
            disabled: cn(
              "text-muted-foreground opacity-50",
              defaultClassNames.disabled,
            ),
            hidden: cn("invisible", defaultClassNames.hidden),
            ...classNames,
          }}
          components={{
            Root: ({ className, rootRef, ...props }) => {
              return (
                <div
                  data-slot="calendar"
                  ref={rootRef}
                  className={cn(className)}
                  {...props}
                />
              );
            },
            Chevron: ({ orientation, className }) => {
              if (orientation === "left") {
                return (
                  <Image
                    src={ArrowLeft}
                    alt="Previous month"
                    width={24}
                    height={24}
                    className={className}
                  />
                );
              }

              if (orientation === "right") {
                return (
                  <Image
                    src={ArrowRight}
                    alt="Next month"
                    width={24}
                    height={24}
                    className={className}
                  />
                );
              }

              return (
                <Image
                  src={ArrowDown}
                  alt="Open select"
                  width={24}
                  height={24}
                  className={className}
                />
              );
            },
            DayButton: ({ ...props }) => (
              <CalendarDayButton locale={locale} {...props} />
            ),
            WeekNumber: ({ children, ...props }) => {
              return (
                <td {...props}>
                  <div className="flex size-(--cell-size) items-center justify-center text-center">
                    {children}
                  </div>
                </td>
              );
            },
            ...components,
          }}
          {...props}
        />
        <div className="mt-3 flex gap-[10px]">
          <BtnCommon
            type="button"
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={onReset}
          >
            초기화
          </BtnCommon>
          <BtnCommon
            type="button"
            size="sm"
            className="flex-1"
            onClick={onApply}
          >
            적용
          </BtnCommon>
        </div>
      </div>
    // <div className="relative">
    // </div>
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[range-end=true]:bg-green-100 data-[range-end=true]:text-green-600 data-[range-middle=true]:bg-muted rounded-l-(--cell-radius) data[-range-middle=true]:text-foreground data-[range-start=true]:bg-green-100 data-[range-start=true]:text-green-600 relative isolate z-10 flex size-auto w-9 min-w-(--cell-size) cursor-pointer flex-col gap-1 border-0 py-[9px] leading-none hover:bg-green-100 data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[selected-single=true]:font-medium data-[selected-single=true]:text-green-600 [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
