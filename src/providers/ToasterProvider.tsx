"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

// 프로젝트 전체에서 사용하는 공용 Toast 컨테이너 컴포넌트입니다.
// Sonner 라이브러리의 Toaster를 감싸서 프로젝트 디자인과 설정을 통일합니다.
//
// 앱의 루트 레이아웃(App Layout)에 1번만 배치하여
// 모든 페이지에서 toast 알림을 사용할 수 있도록 합니다.
//
// 사용 예시 (layout.tsx)
// <ToasterProvider />
export function ToasterProvider({ ...props }: ToasterProps) {
  // 현재 앱의 테마 상태(light, dark, system)를 가져옵니다.
  // toast UI도 동일한 테마를 사용하도록 동기화합니다.
  const { theme = "system" } = useTheme();

  return (
    // Sonner 라이브러리의 Toast 컨테이너
    <Sonner
      // 라이트 / 다크 모드에 맞게 toast 테마를 변경합니다.
      theme={theme as ToasterProps["theme"]}
      // 전역 스타일 제어를 위한 클래스
      className="toaster group"
      // 피그마 디자인 가이드 기준
      // toast 기본 위치를 화면 상단 중앙으로 설정합니다.
      position="top-center"
      // 모든 toast에 공통으로 적용될 기본 옵션입니다.
      toastOptions={{
        // sonner 기본 스타일을 제거하고
        // 프로젝트에서 만든 커스텀 스타일을 사용합니다.
        unstyled: true,

        // toast 기본 노출 시간 (2초)
        duration: 2000,

        // toast에 적용할 커스텀 클래스 이름
        classNames: {
          toast: "cn-toast",
        },
      }}
      // 부모에서 전달된 추가 props가 있다면 병합합니다.
      {...props}
    />
  );
}
