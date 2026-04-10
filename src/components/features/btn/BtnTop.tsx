"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function BtnTop() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);

  // 라우트 변경 시 상태 초기화 및 스크롤 리셋
  useEffect(() => {
    window.scrollTo(0, 0);
    lastScrollY.current = 0;
    setVisible(false); // 페이지 이동 시 항상 숨김
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const isScrollingUp = currentY < lastScrollY.current;

      if (currentY > 100 && !isScrollingUp) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      lastScrollY.current = currentY;
    };

    // 마운트 시 초기 상태 동기화
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const positionClass = pathname === "/meetings"
    ? "lg:bottom-34 lg:right-16 sm:right-6 bottom-[92px] right-6"
    : pathname === "/lounge"
      ? "sm:bottom-6 bottom-[92px] right-6"
      : "bottom-6 right-6";

  return (
    <button
      type="button"
      aria-label="맨 위로 이동"
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-main-purple text-white shadow-lg transition-all duration-300 hover:bg-slate-950 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        positionClass,
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <ChevronUp
        className="h-5 w-5"
        aria-hidden="true"
      />
    </button>
  );
}