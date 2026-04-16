"use client";

import { Tab } from "@/shared/components/ui/Tab";
import { ReactNode, useEffect, useState } from "react";

interface ProfileTabControllerProps {
  tabs: { value: string; label: string }[];
  currentTab: string;
  children: ReactNode;
}

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
    <Tab
      tabs={tabs}
      value={activeTab}
      onValueChange={updateTabParamInHistory}
    >
      {children}
    </Tab>
  );
}
