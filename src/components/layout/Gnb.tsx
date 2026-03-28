"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import profileMd from "@/assets/img/profile/female1-m.jpg";
import { Sheet, SheetTrigger } from "@/components/shadcnOrigin/sheet";
import SideBar from "@/components/layout/SideBar";
import { useAuthStore } from "@/store/useAuthStore";
import Notification from "@/components/layout/notification/Notification";

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
      className="text-slate-600 transition-colors group-hover:text-[#260656]"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
    {hasUnread && (
      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#260656] ring-2 ring-white" />
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

  const isLoginPage = pathname === "/login";
  const [isOpen, setIsOpen] = useState(false);
  const isAuthReady = !isAuthLoading;

  const handleLogout = async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    clearAuth();
    router.push("/login");
  };

  const handleLogin = async () => {
    router.push("/login");
  };

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationOpen]);

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-center border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl transition-all sm:h-20 sm:px-6">
      <div className="flex h-full w-full max-w-[1200px] items-center justify-between">
        <div className="flex items-center gap-10 lg:gap-14">
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105 active:scale-95"
          >
            <span className="text-3xl font-black tracking-tighter text-[#260656]">
              co-git.
            </span>
          </Link>

          <nav className="hidden items-center lg:flex lg:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative py-2 text-sm font-bold tracking-tight transition-all",
                  pathname === link.href
                    ? "text-[#260656] after:absolute after:bottom-0 after:left-1/2 after:h-[3px] after:w-5 after:-translate-x-1/2 after:rounded-full after:bg-[#260656]"
                    : "text-slate-400 hover:text-slate-900",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="relative flex h-full items-center justify-center gap-4 sm:gap-6">
          {isLoggedIn && (
            <div ref={notificationRef}>
              <button
                type="button"
                onClick={() => setIsNotificationOpen((prev) => !prev)}
                className="group hidden h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-100 bg-slate-50 transition-all hover:bg-white hover:shadow-md lg:flex"
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
              <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
            ) : isLoggedIn ? (
              <button
                className="flex cursor-pointer items-center justify-center transition-all active:scale-95"
                onClick={() => router.push(`/users/${user.id}`)}
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-slate-200 p-[1.5px] transition-all hover:border-[#260656]/50">
                  <Image
                    src={profileMd}
                    alt="프로필"
                    fill
                    className="rounded-[9px] object-cover"
                  />
                </div>
              </button>
            ) : isLoginPage ? null : (
              <button
                onClick={handleLogin}
                className="hidden cursor-pointer rounded-xl bg-[#260656] px-6 py-2.5 text-sm font-bold text-white shadow-[0_8px_16px_-4px_rgba(38,6,86,0.25)] transition-all hover:bg-[#1a043d] hover:shadow-[0_12px_20px_-4px_rgba(38,6,86,0.3)] active:scale-95 lg:flex"
              >
                로그인
              </button>
            )}
          </div>

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="hidden cursor-pointer lg:block"
            >
              <span className="text-sm font-bold text-slate-400 transition-colors hover:text-slate-900">
                로그아웃
              </span>
            </button>
          )}

          <div className="flex items-center justify-center lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition-all active:scale-95">
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
