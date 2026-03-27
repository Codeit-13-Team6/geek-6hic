"use client";

import Link from "next/link";
import {
  SheetContent,
  SheetClose,
  SheetTitle,
} from "@/components/shadcnOrigin/sheet";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "모임 찾기", href: "/meetings" },
  { name: "나의 모임", href: "/my-meetings" },
  { name: "랭킹 보드", href: "/ranking" },
  { name: "스프린트 라운지", href: "/lounge" },
];

interface SideBarProps {
  isLoggedIn: boolean;
  handleLogout: () => Promise<void>;
  handleLogin: () => void;
  onClose: () => void;
}

// TO DO: 시간 관계상 추후 기능을 붙힐 수 있는 뼈대 ui 구현 -> 필요에 의해 디자인 수정 + 기능 추가
export default function SideBar({
  isLoggedIn,
  handleLogout,
  handleLogin,
  onClose,
}: SideBarProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  const { user } = useAuthStore();

  return (
    <SheetContent
      side="right"
      className="z-[999999999] flex h-full w-[314px] flex-col rounded-l-[2rem] border-l border-white/60 bg-white/70 px-6 pt-6 pb-8 shadow-[-10px_0_40px_rgba(0,0,0,0.08)] backdrop-blur-[40px] sm:max-w-[314px] [&>button.absolute]:hidden"
    >
      <SheetTitle className="sr-only">모바일 네비게이션 메뉴</SheetTitle>

      <div className="mb-4 flex items-center justify-between">
        <span className="text-xl font-extrabold tracking-tight text-violet-600">
          co-git
        </span>
        <SheetClose className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/50 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white active:scale-95">
          <X className="size-5 text-slate-500 transition-colors group-hover:text-slate-900" />
        </SheetClose>
      </div>

      <nav className="mt-4 flex flex-col gap-2">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className={cn(
                "font-pretendard flex items-center rounded-2xl px-5 py-3.5 text-base transition-all duration-200 active:scale-[0.98]",
                isActive
                  ? "bg-violet-600 font-bold text-white shadow-[0_4px_15px_rgba(139,92,246,0.3)]"
                  : "font-medium text-slate-600 hover:bg-white/60 hover:text-slate-900",
              )}
            >
              {link.name}
            </Link>
          );
        })}

        {isLoggedIn && (
          <>
            <div className="my-3 h-[1px] w-full bg-slate-200/50" />
            <Link
              href={`/users/${user?.id}`}
              onClick={onClose}
              className={cn(
                "font-pretendard flex items-center rounded-2xl px-5 py-3.5 text-base transition-all duration-200 active:scale-[0.98]",
                pathname.startsWith(`/users`)
                  ? "bg-violet-600 font-bold text-white shadow-[0_4px_15px_rgba(139,92,246,0.3)]"
                  : "font-medium text-slate-600 hover:bg-white/60 hover:text-slate-900",
              )}
            >
              마이페이지
            </Link>
          </>
        )}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        {isLoggedIn ? (
          <SheetClose
            onClick={handleLogout}
            className="font-pretendard flex w-full items-center justify-center rounded-2xl border border-slate-200/50 bg-slate-100/50 px-4 py-3.5 text-base font-medium text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800 active:scale-[0.98]"
          >
            로그아웃
          </SheetClose>
        ) : isLoginPage ? null : (
          <SheetClose
            onClick={handleLogin}
            className="font-pretendard flex w-full items-center justify-center rounded-2xl bg-violet-600 px-4 py-3.5 text-base font-bold text-white shadow-[0_4px_15px_rgba(139,92,246,0.3)] transition-all hover:bg-violet-700 active:scale-[0.98]"
          >
            로그인
          </SheetClose>
        )}
      </div>
    </SheetContent>
  );
}
