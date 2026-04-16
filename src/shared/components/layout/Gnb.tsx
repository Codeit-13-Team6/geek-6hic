"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Bell, Menu } from "lucide-react";
import { getNotifications } from "@/shared/api/client/notifications";
import { Sheet, SheetTrigger } from "@/shared/components/ui/sheet";
import { useAuthStore } from "@/infra/store/useAuthStore";
import Notification from "@/shared/components/layout/notification/Notification";
import axiosInstance from "@/infra/auth/fetcher.client";
import SideBar from "./SideBar";
import FallbackImage from "../img/FallbackImage";

const BellIcon = ({ hasUnread }: { hasUnread: boolean }) => (
  <div className="bell-hover relative flex items-center justify-center p-1">
    <Bell
      className="group-hover:text-main-purple h-5 w-5 text-slate-600 transition-colors"
      strokeWidth={2.2}
    />
    {hasUnread && (
      <span className="absolute top-1 right-1 z-20 block h-1.5 w-1.5 rounded-full bg-[#00d287] ring-2 ring-white" />
    )}
  </div>
);

const NAV_LINKS = [
  { name: "모임 찾기", href: "/meetings", exact: true },
  { name: "나의 모임", href: "/my-meetings" },
  { name: "랭킹 보드", href: "/ranking" },
  { name: "스프린트 라운지", href: "/lounge", exact: true },
];

const isNavActive = (pathname: string, href: string, exact?: boolean) => {
  if (exact) return pathname === href;
  return pathname.startsWith(href);
};

interface GnbProps {
  initialUser?: { id: number; name: string; image?: string | null } | null;
}

export function Gnb({ initialUser }: GnbProps) {
  const router = useRouter();
  const pathname = usePathname();
  const storeUser = useAuthStore((s) => s.user);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const user = storeUser ?? initialUser;
  const isLoggedIn = !!user;
  const isBlobUrl = user?.image?.startsWith("blob:");

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const isNavigating = useRef(false);
  const isAuthReady = !isAuthLoading;

  const handleLogout = async () => {
    await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
    clearAuth();
    window.location.replace("/login");
  };

  const handleLogin = async () => router.push("/login");

  useEffect(() => {
    if (!isAuthReady || !isLoggedIn) return;

    const syncUnreadNotifications = async () => {
      try {
        const notifications = await getNotifications();
        setHasUnreadNotifications(notifications.some((item) => !item.isRead));
      } catch {
        setHasUnreadNotifications(false);
      }
    };
    syncUnreadNotifications();
  }, [isAuthReady, isLoggedIn]);

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
    <header className="sticky top-0 z-[100] flex h-16 w-full items-center justify-center border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl transition-all md:h-18 2xl:px-0">
      <div className="flex h-full w-full max-w-[1280px] items-center justify-between">
        {/* 왼쪽 영역 */}
        <div className="flex items-center gap-10 lg:gap-14">
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-black active:scale-95"
          >
            <span className="text-main-purple text-2xl font-black tracking-tighter sm:text-3xl">
              co-git.
            </span>
          </Link>

          <nav className="hidden items-center md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (isNavigating.current) {
                    e.preventDefault();
                    return;
                  }
                  isNavigating.current = true;
                  setTimeout(
                    () => {
                      isNavigating.current = false;
                    },
                    isNavActive(pathname, link.href, link.exact) ? 500 : 100,
                  );
                }}
                className={cn(
                  "relative px-4 py-2 text-sm font-bold tracking-tight transition-all focus-visible:ring-2 focus-visible:ring-black",
                  isNavActive(pathname, link.href, link.exact)
                    ? "text-main-purple after:bg-main-purple after:absolute after:-bottom-1 after:left-1/2 after:h-[3px] after:w-5 after:-translate-x-1/2 after:rounded-full"
                    : "text-slate-400 hover:text-slate-900",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* 오른쪽 영역 */}
        <div className="flex h-full items-center gap-0 sm:gap-2 md:gap-4">
          {isLoggedIn ? (
            <div
              className="flex items-center gap-0 md:gap-2"
              ref={notificationRef}
            >
              <button
                type="button"
                aria-label="알림 열기"
                onClick={() => setIsNotificationOpen((prev) => !prev)}
                className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-all hover:bg-slate-50"
              >
                <BellIcon hasUnread={hasUnreadNotifications} />
              </button>

              <button
                className="relative hidden h-6 w-6 cursor-pointer items-center justify-center overflow-hidden rounded-xl transition-all hover:opacity-80 active:scale-95 md:flex"
                onClick={() => router.push(`/users/${user.id}`)}
                aria-label="프로필 페이지 이동"
              >
                <FallbackImage
                  src={user?.image}
                  type="user"
                  alt="유저 프로필"
                  fill
                  className="object-cover"
                />
              </button>

              <div className="mx-1 hidden h-3 w-[1px] bg-slate-200 md:block" />

              <button
                onClick={handleLogout}
                className="hidden cursor-pointer rounded-lg px-3 py-1.5 transition-all md:block"
              >
                <span className="hover:text-main-purple text-sm font-bold text-slate-600">
                  로그아웃
                </span>
              </button>

              <div className="absolute z-50 sm:absolute">
                <Notification
                  isOpen={isNotificationOpen}
                  aria-label="알림 닫기"
                  onClose={() => setIsNotificationOpen(false)}
                  onUnreadChange={setHasUnreadNotifications}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="hidden cursor-pointer rounded-lg px-4 py-2 transition-all active:scale-95 sm:block"
            >
              <span className="hover:text-main-purple text-sm font-bold text-slate-600">
                로그인
              </span>
            </button>
          )}

          {/* 모바일 햄버거 */}
          <div className="flex items-center justify-center md:hidden">
            <Sheet
              open={isOpen}
              onOpenChange={setIsOpen}
              aria-label="메뉴 열기"
            >
              <SheetTrigger className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:bg-slate-50 active:scale-95">
                <Menu className="h-5 w-5 text-slate-800" aria-hidden="true" />
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
