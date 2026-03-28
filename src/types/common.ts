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
