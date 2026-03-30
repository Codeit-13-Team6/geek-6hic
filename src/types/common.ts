import { ReactNode } from "react";

export interface ModalCommonProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  children: ReactNode;
  title?: string;
  titleClassName?: string;
  contentClassName?: string;
  disablePointerDismissal?: boolean;
}

export interface TabItem {
  value: string;
  label: string;
}

export interface TimePickerCommonProps {
  value: string;
  onChange: (value: string) => void;
}

export type ToastSize = "lg" | "sm";

export interface ToastCommonProps {
  message: string;
  size?: ToastSize;
  duration?: number;
  className?: string;
}

export interface SideBarProps {
  isLoggedIn: boolean;
  handleLogout: () => Promise<void>;
  handleLogin: () => void;
  onClose: () => void;
}

export interface TabsLineProps {
  tabs: TabItem[];
  defaultValue?: string;
  /**   children 사용 방법 간략하게 작성 , ui/tabs 에서 TabsContent 를 import 해서 사용해야함
   *  <Tab>
   *     <TabsContent value="liked">
   *      찜한 모임 내용
   *     </TabsContent>
   *    <TabsContent value="created">
   *    내가 만든 모임 내용
   *    </TabsContent>
   *    <TabsContent value="lounge">
   *    라운지 게시물 내용
   *    </TabsContent>
   *  </Tab>
   */
  children?: ReactNode;
}

export interface MemberProviderProps {
  children: React.ReactNode;
}
