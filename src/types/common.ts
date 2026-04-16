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

export type ToastSize = "lg" | "sm";

export interface ToastProps {
  type?: "success" | "error" | "info";
  message: string | ReactNode;
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

export interface MemberProviderProps {
  children: React.ReactNode;
}
