"use client";

import { Tab } from "@/shared/components/ui/Tab";
import { useUrlQuery } from "@/shared/hooks/useUrlQuery";
import { ReactNode } from "react";

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
  const { updateParams } = useUrlQuery();

  return (
    <Tab
      tabs={tabs}
      value={currentTab}
      onValueChange={(val) => updateParams({ tab: val })}
    >
      {children}
    </Tab>
  );
}
