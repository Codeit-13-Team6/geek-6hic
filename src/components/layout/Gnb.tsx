"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import bellIconLg from "@/assets/icon/bells/bell-default-lg-false.svg";
import selectedBellIconLg from "@/assets/icon/bells/bell-default-lg-true.svg";
import menu from "@/assets/icon/menu/menu.svg";
import logoSm from "@/assets/img/logo/logo-sm.jpg";
import logoLg from "@/assets/img/logo/logo-lg.jpg";
import profileMd from "@/assets/img/profile/female1-m.jpg";
import { Sheet, SheetTrigger } from "@/components/shadcnOrigin/sheet";
import SideBar from "@/components/layout/SideBar";
import { useAuthStore } from "@/store/useAuthStore";
import Notification from "@/components/layout/notification/Notification";

const GitBranchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-violet-600"
  >
    <line x1="6" x2="6" y1="3" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

const BellIcon = ({ hasUnread }: { hasUnread: boolean }) => (
  <div className="relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-slate-600 transition-colors group-hover:text-violet-600"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
    {hasUnread && (
      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
    )}
  </div>
);

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-slate-800"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const NAV_LINKS = [
  { name: "모임 찾기", href: "/meetings" },
  { name: "나의 모임", href: "/my-meetings" },
  { name: "랭킹 보드", href: "/ranking" },
  { name: "스프린트 라운지", href: "/lounge" },
];

export function Gnb() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const isLoggedIn = !!user;

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  // 로그인페이지에서 로그인버튼 삭제하기 위해서
  const isLoginPage = pathname === "/login";

  // 태블릿, 모바일 sheetClose로 불가능해서 상태로관리
  const [isOpen, setIsOpen] = useState(false);

  // 로딩상태
  const isAuthReady = !isAuthLoading;

  const handleLogout = async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    clearAuth();
    router.push("/login");
  };

  const handleLogin = async () => {
    router.push("/login");
  };

  // 알림창 외부 클릭 시 닫기
  useEffect(() => {
    if (!isNotificationOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-center border-b border-rose-100/40 bg-white/70 px-4 shadow-[0_4px_30px_rgba(251,113,133,0.06)] backdrop-blur-[40px] transition-all sm:h-20 sm:px-6 lg:px-8">
      <div className="flex h-full w-full max-w-[1280px] items-center justify-between">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95"
          >
            <span className="hidden bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:block">
              co-git
            </span>
          </Link>

          <nav className="hidden items-center rounded-full border border-rose-100/60 bg-white/60 p-1.5 shadow-inner backdrop-blur-md lg:flex lg:gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300",
                  pathname === link.href
                    ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-[0_2px_10px_rgba(251,113,133,0.25)]"
                    : "text-slate-500 hover:bg-rose-50/80 hover:text-rose-600",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="relative flex h-full items-center justify-center gap-3 sm:gap-4">
          {isLoggedIn && (
            <div ref={notificationRef}>
              <button
                type="button"
                onClick={() => setIsNotificationOpen((prev) => !prev)}
                className="group flex hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-rose-100/60 bg-white/60 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-rose-50 lg:flex"
              >
                <BellIcon hasUnread={hasUnreadNotifications} />
              </button>

              <div className="absolute top-[calc(100%+12px)] right-0 z-50 hidden lg:block">
                <Notification
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                  onUnreadChange={setHasUnreadNotifications}
                />
              </div>
            </div>
          )}

          <div className="hidden sm:block">
            {!isAuthReady ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-rose-100/50" />
            ) : isLoggedIn ? (
              <button
                className="flex cursor-pointer items-center justify-center transition-transform hover:scale-105 active:scale-95"
                onClick={() => router.push(`/users/${user.id}`)}
              >
                <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-rose-100 to-orange-100 p-[2px] ring-2 ring-rose-200 ring-offset-2">
                  <Image
                    src={profileMd}
                    alt="프로필"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              </button>
            ) : isLoginPage ? null : (
              <button
                onClick={handleLogin}
                className="hidden cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-2.5 text-sm font-bold text-white transition-all hover:from-rose-600 hover:to-orange-600 hover:shadow-[0_4px_15px_rgba(251,113,133,0.35)] active:scale-95 lg:flex"
              >
                로그인
              </button>
            )}
          </div>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hidden cursor-pointer px-3 py-2 lg:block"
            >
              <span className="text-sm font-bold text-slate-400 transition-colors hover:text-slate-700">
                로그아웃
              </span>
            </button>
          ) : null}

          <div className="flex items-center justify-center lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-100/60 bg-white/60 shadow-sm backdrop-blur-md transition-all hover:bg-rose-50 active:scale-95">
                <MenuIcon />
              </SheetTrigger>
              <SideBar
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
                handleLogin={handleLogin}
                onClose={() => setIsOpen(false)}
              />
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
