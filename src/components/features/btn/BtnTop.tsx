"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function BtnTop() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const isScrollingUp = currentY < lastScrollY.current;

      if (currentY > 100 && !isScrollingUp) {
        setVisible(true);  // 100px 넘고 아래로 내려갈 때 보임
      } else {
        setVisible(false); // 위로 올라가거나 100px 이하면 숨김
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const positionClass = pathname === "/meetings"
  ? "lg:bottom-36 lg:right-16 sm:right-6 bottom-22 right-6"
  : pathname === "/lounge"
  ? "sm:bottom-6 bottom-22 right-6"
  : "bottom-6 right-6";

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-main-purple text-white shadow-lg transition-all duration-300 hover:bg-slate-950 active:scale-95 shadow-[0_20px_40px_rgba(38,6,86,0.3)]",
        positionClass,
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}