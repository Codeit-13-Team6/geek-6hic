"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";

interface ProfileTabControllerProps {
  tabs: { value: string; label: string }[];
  currentTab: string;
  children: ReactNode;
}

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

export default function UserTabController({
  tabs,
  currentTab,
  children,
}: ProfileTabControllerProps) {
  const [activeTab, setActiveTab] = useState(currentTab);

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  const updateTabParamInHistory = (tab: string) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    url.searchParams.delete("page");
    url.searchParams.delete("cursor");
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
  };

  return (
    <Tabs
      defaultValue={tabs[0]?.value}
      value={activeTab}
      onValueChange={updateTabParamInHistory}
      className={tabsRoot}
    >
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
