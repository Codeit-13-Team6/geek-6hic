"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Bell, Menu } from "lucide-react";
import profileMd from "@/assets/img/profile/female1-m.jpg";
import { getNotifications } from "@/api/client/notifications";
import { Sheet, SheetTrigger } from "@/components/shadcnOrigin/sheet";
import { useAuthStore } from "@/store/useAuthStore";
import Notification from "@/components/layout/notification/Notification";
import axiosInstance from "@/lib/clientFetcher";
import SideBar from "./SideBar";

const BellIcon = ({ hasUnread }: { hasUnread: boolean }) => (
  <div className="relative flex items-center justify-center p-1">
    <Bell
      className="group-hover:text-main-purple h-5 w-5 text-slate-600 transition-colors"
      strokeWidth={2.2}
    />
    {hasUnread && (
      <span className="absolute top-1 right-1 z-20 block h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-white" />
    )}
  </div>
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
    router.push("/login");
  };

  const handleLogin = async () => router.push("/login");

  useEffect(() => {
    if (!isAuthReady || !isLoggedIn) {
      setHasUnreadNotifications(false);
      return;
    }
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
    <header className="sticky top-0 z-[100] flex h-16 w-full items-center justify-center border-b border-slate-200 bg-white/80 px-2 backdrop-blur-xl transition-all sm:px-6 md:h-18">
      <div className="flex h-full w-full max-w-[1350px] items-center justify-between">
        {/* 왼쪽 영역 */}
        <div className="flex items-center gap-10 lg:gap-14">
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105 active:scale-95"
          >
            <span className="text-main-purple px-2 text-2xl font-black tracking-tighter sm:text-3xl">
              co-git.
            </span>
          </Link>

          <nav className="hidden items-center md:flex md:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (pathname.startsWith(link.href) || isNavigating.current) {
                    e.preventDefault();
                    return;
                  }
                  isNavigating.current = true;
                  setTimeout(() => {
                    isNavigating.current = false;
                  }, 100);
                }}
                className={cn(
                  "relative py-2 text-sm font-bold tracking-tight transition-all",
                  pathname.startsWith(link.href)
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
                onClick={() => setIsNotificationOpen((prev) => !prev)}
                className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-all hover:bg-slate-50"
              >
                <BellIcon hasUnread={hasUnreadNotifications} />
              </button>

              <button
                className="hidden h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl transition-all hover:opacity-80 active:scale-95 md:flex"
                onClick={() => router.push(`/users/${user.id}`)}
              >
                {user?.image && !isBlobUrl ? (
                  <Image
                    src={user.image}
                    alt="프로필"
                    width={32}
                    height={32}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <Image
                    src={profileMd}
                    alt="기본 프로필"
                    width={32}
                    height={32}
                    className="h-9 w-9 object-cover"
                  />
                )}
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

              <div className="fixed top-0 right-0 z-50 sm:absolute sm:top-[calc(100%+16px)] sm:right-0">
                <Notification
                  isOpen={isNotificationOpen}
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
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:bg-slate-50 active:scale-95">
                <Menu className="h-5 w-5 text-slate-800" />
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
