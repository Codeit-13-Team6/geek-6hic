"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { logoutUser } from "@/api/client/auth";
import { getNotifications } from "@/api/client/notifications";
import { Sheet, SheetTrigger } from "@/components/ui/Sheet";
import { useAuthStore } from "@/store/useAuthStore";
import Notification from "@/components/layout/Notification";
import SideBar from "./SideBar";

interface GnbActionsClientProps {
  isLoggedIn: boolean;
  mode?: "full" | "bell" | "logout";
}

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

export default function GnbActionsClient({
  isLoggedIn,
  mode = "full",
}: GnbActionsClientProps) {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // 네트워크 실패여도 클라이언트 세션은 정리해서 잔상 UI를 방지
    } finally {
      clearAuth();
      window.location.replace("/login");
    }
  };

  const handleLogin = async () => router.push("/login");

  useEffect(() => {
    if (!isLoggedIn) return;

    const syncUnreadNotifications = async () => {
      try {
        const notifications = await getNotifications();
        setHasUnreadNotifications(notifications.some((item) => !item.isRead));
      } catch {
        setHasUnreadNotifications(false);
      }
    };
    syncUnreadNotifications();
  }, [isLoggedIn]);

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

  if (mode === "logout") {
    return isLoggedIn ? (
      <button
        onClick={handleLogout}
        className="hidden cursor-pointer rounded-lg px-3 py-1.5 transition-all md:block"
      >
        <span className="hover:text-main-purple text-sm font-bold text-slate-600">
          로그아웃
        </span>
      </button>
    ) : null;
  }

  if (mode === "bell") {
    return (
      <>
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

            <div className="absolute z-50 sm:absolute">
              <Notification
                isOpen={isNotificationOpen}
                aria-label="알림 닫기"
                onClose={() => setIsNotificationOpen(false)}
                onUnreadChange={setHasUnreadNotifications}
              />
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-center md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen} aria-label="메뉴 열기">
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
      </>
    );
  }

  return (
    <>
      {!isLoggedIn ? (
        <button
          onClick={handleLogin}
          className="hidden cursor-pointer rounded-lg px-4 py-2 transition-all active:scale-95 sm:block"
        >
          <span className="hover:text-main-purple text-sm font-bold text-slate-600">
            로그인
          </span>
        </button>
      ) : null}

      <div className="flex items-center justify-center md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen} aria-label="메뉴 열기">
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
    </>
  );
}
