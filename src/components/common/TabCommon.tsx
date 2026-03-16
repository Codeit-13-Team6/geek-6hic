import { type ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
export { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";


const tabsRoot = {
  lg: "w-full !h-[60px] !border-b-2 !border-border",
  sm: "w-full !h-[40px] !border-b-2 !border-border",
};

const lineList = {
  lg: cn(
    "!flex !gap-0 w-full justify-start items-end p-0 !h-[60px] ",
  ),
  sm: cn(
    "!flex !gap-0 w-full justify-start items-end p-0 !h-[40px] ",
  ),
};


const triggerBase = cn(
  "after:hidden font-bold flex-none rounded-none !px-0 cursor-pointer !h-[60px]",
  "border-0 border-b-2 border-border w-160 ",
  "text-gray-600 hover:text-main-green-600",
  "data-active:!border-main-green-600 data-active:text-main-green-600",
);



const triggerSize = {
  lg: cn(triggerBase, "w-[160px] h-[60px] text-[20px] "),
  sm: cn(triggerBase, "w-[112px] h-[40px] text-[14px]"),
};

interface TabItem { value: string; label: string };

const defaultTabs: TabItem[] = [
  { value: "liked", label: "찜한 모임" },
  { value: "created", label: "내가 만든 모임" },
  { value: "lounge", label: "라운지 게시물" },
];


interface TabsLineProps {
  tabs?: TabItem[];
  // defaultValue 는 기본적으로 선택되는 탭 , 탭의 value 값을 집어넣어주면 됨
  defaultValue?: string;
  size?: "lg" | "sm";

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

function TabCommon({ tabs = defaultTabs, defaultValue, size = "lg", children }: TabsLineProps) {
  return (
    <Tabs defaultValue={defaultValue ?? tabs[0].value} className={tabsRoot[size]}>
      <TabsList variant="line" className={lineList[size]}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={triggerSize[size]}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}

export { TabCommon }