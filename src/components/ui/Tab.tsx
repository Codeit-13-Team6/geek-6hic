"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/shadcnOrigin/tabs";
import { cn } from "@/lib/utils";
import { TabsLineProps } from "@/types";

const tabsRoot = "w-full flex flex-col";

const lineList = cn(
  "relative flex h-auto w-full items-end justify-start gap-10 border-b border-slate-100 bg-transparent p-0",
);

const triggerBase = cn(
  "relative flex items-center justify-center bg-transparent p-0 transition-all outline-none",
  "text-base font-bold tracking-widest text-slate-400 uppercase hover:text-slate-900",
  "data-active:text-slate-950",
  "data-active:after:bg-main-purple data-active:after:absolute data-active:after:bottom-[-1px] data-active:after:h-[2px] data-active:after:w-full data-active:after:content-['']",
  "md:cursor-pointer",
);

const triggerSize = cn(
  triggerBase,
  "h-12 w-[112px] text-sm",
  "md:h-16 md:w-[160px] md:text-base",
);

function Tab({ tabs, defaultValue, children }: TabsLineProps) {
  return (
    <Tabs defaultValue={defaultValue ?? tabs[0]?.value} className={tabsRoot}>
      <TabsList variant="line" className={lineList}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={triggerSize}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="w-full">{children}</div>
    </Tabs>
  );
}

export { Tab };
