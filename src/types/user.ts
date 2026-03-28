import type { NotificationItem } from "@/types/notification";
import { TabItem } from "@/types";

import { ReactNode } from "react";

export interface User {
  id: number;
  teamId: string;
  email: string;
  name: string;
  companyName: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileUpdateProps {
  name: string;
  email?: string;
  companyName: string;
  image?: string | null;
}

export interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadChange: (hasUnread: boolean) => void;
}

export interface NotificationCardProps {
  notification: NotificationItem;
  onClick?: (notification: NotificationItem) => void;
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
