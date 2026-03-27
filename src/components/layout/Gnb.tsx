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

  useEffect(() => {
    if (!isNotificationOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isNotificationOpen]);

  return (
    <header className="sticky top-0 z-100 flex h-12 w-full items-center justify-center border-b border-gray-200 bg-white px-5 sm:h-22 sm:px-10">
      <div className="flex h-8 w-full max-w-7xl items-center justify-between sm:h-14">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src={logoSm}
              alt="로고"
              height={32}
              className="block sm:hidden"
            />
            <Image
              src={logoLg}
              alt="로고"
              height={39}
              className="hidden sm:block"
            />
          </Link>

          <nav className="hidden items-center lg:flex lg:gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "font-pretendard hover:text-main-green-600 font-medium whitespace-nowrap transition-all hover:font-semibold sm:px-2 sm:py-4 sm:text-base lg:px-4",
                  pathname === link.href
                    ? "font-semibold text-green-600"
                    : "text-slate-600",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="relative flex h-full items-center justify-center gap-4 sm:gap-3 lg:gap-6">
          {isLoggedIn && (
            <div ref={notificationRef}>
              <button
                type="button"
                onClick={() => setIsNotificationOpen((prev) => !prev)}
                className="flex cursor-pointer items-center justify-center"
              >
                <Image
                  src={hasUnreadNotifications ? selectedBellIconLg : bellIconLg}
                  alt="알림"
                  width={24}
                  height={24}
                />
              </button>
              {isNotificationOpen && (
                <button
                  type="button"
                  aria-label="알림창 닫기"
                  onClick={() => setIsNotificationOpen(false)}
                  className="fixed inset-0 z-40 bg-black/30 sm:hidden"
                />
              )}

              <div className="fixed top-0 right-0 z-50 sm:absolute sm:top-[calc(100%+12px)] sm:right-0">
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
              <div className="h-[22px] w-16" />
            ) : isLoggedIn ? (
              <button
                className="flex cursor-pointer items-center justify-center"
                onClick={() => router.push(`/users/${user.id}`)}
              >
                <Image
                  src={profileMd}
                  alt="프로필"
                  width={54}
                  height={54}
                  className="hidden rounded-full lg:block"
                />
              </button>
            ) : isLoginPage ? null : (
              <button
                onClick={handleLogin}
                className="hidden cursor-pointer lg:block"
              >
                <span className="font-pretendard text-base font-medium whitespace-nowrap text-slate-600 transition-colors hover:text-gray-900">
                  로그인
                </span>
              </button>
            )}
          </div>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hidden cursor-pointer lg:block"
            >
              <span className="font-pretendard text-base font-medium whitespace-nowrap text-slate-600 transition-colors hover:text-gray-900">
                로그아웃
              </span>
            </button>
          ) : null}

          <div className="flex items-center justify-center lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="flex items-center justify-center">
                <Image src={menu} alt="메뉴" width={24} height={24} />
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
