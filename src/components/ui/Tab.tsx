import { Tabs, TabsList, TabsTrigger } from "@/components/shadcnOrigin/tabs";
import { cn } from "@/lib/utils";
import { TabsLineProps } from "@/types";

const tabsRoot = "w-full !border-b-2 !border-border !h-[40px] md:!h-[60px]";

const lineList = cn(
  "!flex !h-[40px] w-full items-end justify-center !gap-0 p-0 sm:justify-start md:!h-[60px]",
);

const triggerBase = cn(
  "!h-[40px] flex-none rounded-none !p-0 font-bold after:hidden md:!h-[60px] md:cursor-pointer",
  "border-border w-160 border-0 border-b-2",
  "hover:text-main-green-600 text-gray-600",
  "data-active:!border-main-green-600 data-active:text-main-green-600",
);

const triggerSize = cn(
  triggerBase,
  "h-[40px] w-[112px] text-[14px]",
  "md:h-[60px] md:w-[160px] md:text-[20px]",
);

function Tab({ tabs, defaultValue, children }: TabsLineProps) {
  return (
    <Tabs defaultValue={defaultValue ?? tabs[0].value} className={tabsRoot}>
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
      {children}
    </Tabs>
  );
}

export { Tab };
