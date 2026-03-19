"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

// 앱 전역에서 사용하는 toast 컨테이너입니다.
// 루트 레이아웃에 한 번만 배치하여 전체 페이지에서 공통으로 사용합니다.
export function ToasterProvider({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group flex justify-center"
      position="top-center"
      toastOptions={{
        unstyled: true,
        duration: 2000,
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
}
