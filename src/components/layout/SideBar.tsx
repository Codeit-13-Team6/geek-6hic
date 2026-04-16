"use client";

import Link from "next/link";
import {
  SheetContent,
  SheetClose,
  SheetTitle,
} from "@/components/ui/Sheet";
import { X, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { SideBarProps } from "@/types";
import { cn } from "@/lib";
import { useAuthStore } from "@/store/useAuthStore";

const NAV_LINKS = [
  { name: "모임 찾기", href: "/meetings" },
  { name: "나의 모임", href: "/my-meetings" },
  { name: "랭킹 보드", href: "/ranking" },
  { name: "스프린트 라운지", href: "/lounge" },
];

export default function SideBar({
  isLoggedIn,
  handleLogout,
  handleLogin,
  onClose,
}: SideBarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <SheetContent
      side="right"
      className="z-[200] flex h-full w-[290px] flex-col border-l border-white/20 bg-white/50 px-6 pt-10 pb-12 shadow-[-20px_0_80px_rgba(0,0,0,0.05)] backdrop-blur-3xl [&>button.absolute]:hidden"
    >
      <SheetTitle className="sr-only">모바일 네비게이션 메뉴</SheetTitle>

      <div className="flex items-center justify-between px-3">
        <span className="text-[11px] font-black tracking-[0.25em] text-slate-400 uppercase">
          Menu
        </span>
        <SheetClose
          className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/50 active:scale-90"
          aria-label="메뉴 닫기"
        >
          <X
            className="size-5 text-slate-900"
            strokeWidth={2}
            aria-hidden="true"
          />
        </SheetClose>
      </div>

      <nav className="mt-0 flex flex-col gap-1">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className={cn(
                "group flex items-center justify-between rounded-2xl px-4 py-4 transition-all focus-visible:ring-2 focus-visible:ring-black active:scale-[0.98]",
                isActive
                  ? "text-main-purple bg-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                  : "text-slate-500 hover:text-slate-900",
              )}
            >
              <span className="text-[15px] font-bold tracking-tight">
                {link.name}
              </span>
              {isActive && <ChevronRight className="size-4 stroke-[3px]" />}
            </Link>
          );
        })}

        {isLoggedIn && (
          <Link
            href={`/users/${user?.id}`}
            onClick={onClose}
            className={cn(
              "group flex items-center justify-between rounded-2xl px-4 py-4 transition-all active:scale-[0.98]",
              pathname.startsWith("/users")
                ? "text-main-purple bg-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                : "text-slate-500 hover:text-slate-900",
            )}
          >
            <span className="text-[15px] font-bold tracking-tight">
              마이페이지
            </span>
            {pathname.startsWith("/users") && (
              <ChevronRight className="size-4 stroke-[3px]" />
            )}
          </Link>
        )}
      </nav>

      {/* 하단 영역: 심플한 인사말 및 액션 */}
      <div className="mt-auto flex flex-col gap-6 px-3">
        {isLoggedIn ? (
          <div className="flex flex-col gap-5">
            {/* 💡 유저 인사말: 담백하게 텍스트로만 구성 */}
            <p className="text-[15px] font-bold text-slate-900">
              안녕하세요,{" "}
              <span className="text-main-purple">{user?.name || ""}</span>님
            </p>

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center rounded-xl bg-white/60 py-3.5 text-[12px] font-bold tracking-widest text-slate-400 uppercase shadow-sm transition-all hover:bg-white hover:text-slate-900"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              handleLogin();
              onClose();
            }}
            className="bg-main-purple shadow-main-purple/20 flex w-full items-center justify-center rounded-xl py-4 shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <span className="text-sm font-bold tracking-tight text-white">
              로그인
            </span>
          </button>
        )}
      </div>
    </SheetContent>
  );
}
