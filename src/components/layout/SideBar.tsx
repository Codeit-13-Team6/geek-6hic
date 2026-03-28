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
import { SideBarProps } from "@/types";

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
  const isLoginPage = pathname === "/login";

  const { user } = useAuthStore();

  return (
    <SheetContent
      side="right"
      className="z-999999999 flex h-full w-[314px] flex-col rounded-l-[20px] bg-white px-5 pt-6 pb-8 sm:max-w-[314px] [&>button.absolute]:hidden"
    >
      <SheetTitle className="sr-only">모바일 네비게이션 메뉴</SheetTitle>

      <div className="flex justify-start">
        <SheetClose className="text-gray-900 transition-opacity hover:opacity-70">
          <X className="size-6" />
        </SheetClose>
      </div>

      <nav className="mt-8 flex flex-col gap-6">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={onClose}
            className="font-pretendard hover:text-main-green-500 text-base font-medium text-slate-600 transition-colors"
          >
            {link.name}
          </Link>
        ))}

        {isLoggedIn && (
          <Link
            href={`/users/${user?.id}`}
            onClick={onClose}
            className="font-pretendard hover:text-main-green-500 text-base font-medium text-slate-600 transition-colors"
          >
            마이페이지
          </Link>
        )}
      </nav>

      <div className="mt-auto flex justify-end">
        {isLoggedIn ? (
          <SheetClose
            onClick={handleLogout}
            className={
              "font-pretendard hover:text-main-green-500 text-base font-medium text-slate-400 transition-colors"
            }
          >
            로그아웃
          </SheetClose>
        ) : isLoginPage ? null : (
          <SheetClose
            onClick={handleLogin}
            className={
              "font-pretendard hover:text-main-green-500 text-base font-medium text-slate-400 transition-colors"
            }
          >
            로그인
          </SheetClose>
        )}
      </div>
    </SheetContent>
  );
}
