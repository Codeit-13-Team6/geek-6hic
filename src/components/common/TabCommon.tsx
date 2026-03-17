import { type ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
export { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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

interface TabItem {
  value: string;
  label: string;
}

const defaultTabs: TabItem[] = [
  { value: "liked", label: "찜한 모임" },
  { value: "created", label: "내가 만든 모임" },
  { value: "lounge", label: "라운지 게시물" },
];

interface TabsLineProps {
  tabs?: TabItem[];
  // defaultValue 는 기본적으로 선택되는 탭 , 탭의 value 값을 집어넣어주면 됨
  defaultValue?: string;

  /**   children 사용 방법 간략하게 작성 , ui/tabs 에서 TabsContent 를 import 해서 사용해야함
   *  <TabCommon>
   *     <TabsContent value="liked">
   *      찜한 모임 내용
   *     </TabsContent>
   *    <TabsContent value="created">
   *    내가 만든 모임 내용
   *    </TabsContent>
   *    <TabsContent value="lounge">
   *    라운지 게시물 내용
   *    </TabsContent>
   *  </TabCommon>
   */
  children?: ReactNode;
}

function TabCommon({
  tabs = defaultTabs,
  defaultValue,
  children,
}: TabsLineProps) {
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

export { TabCommon };
