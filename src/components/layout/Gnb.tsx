"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import bellIconSm from "@/assets/icon/bells/bell-default-sm-false.svg";
import bellIconLg from "@/assets/icon/bells/bell-default-lg-false.svg";
import menu from "@/assets/icon/menu/menu.svg";
import logoSm from "@/assets/img/logo/logo-sm.jpg";
import logoLg from "@/assets/img/logo/logo-lg.jpg";
import profileMd from "@/assets/img/profile/female1-m.jpg";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import SideBar from "@/components/layout/SideBar";

const NAV_LINKS = [
  { name: "모임 찾기", href: "/meetings" },
  { name: "나의 모임", href: "/my-meetings" },
  { name: "랭킹 보드", href: "/ranking" },
  { name: "스프린트 라운지", href: "/lounge" },
];

export function Gnb() {
  // TODO: 실제 프로젝트에서는 전역 상태나 세션 정보를 받아와서 사용
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-12 w-full items-center justify-center border-b border-gray-200 bg-white px-5 sm:px-10 md:h-22">
      <div className="flex h-8 w-full max-w-7xl items-center justify-between md:h-14 lg:pr-2">
        {/* 좌측: 로고 및 네비게이션 */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src={logoSm}
              alt="로고"
              height={32}
              className="block md:hidden"
            />
            <Image
              src={logoLg}
              alt="로고"
              height={39}
              className="hidden md:block"
            />
          </Link>

          <nav className="hidden items-center md:flex md:gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-pretendard hover:text-main-green-600 text-base font-medium text-slate-600 transition-all hover:font-semibold md:p-4"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* 우측: 로그인/프로필 영역 */}
        <div className="flex h-full items-center justify-center gap-4 md:gap-6">
          {/* 1. 알림 (로그인 시에만 렌더링. sm/lg 아이콘 스위칭) */}
          {isLoggedIn && (
            <button className="flex items-center justify-center">
              <Image
                src={bellIconSm}
                alt="알림"
                width={20}
                height={20}
                className="block md:hidden"
              />
              <Image
                src={bellIconLg}
                alt="알림"
                width={24}
                height={24}
                className="hidden md:block"
              />
            </button>
          )}

          {/* 2. 데스크탑 전용 영역 (프로필 or 로그인 버튼) */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <button className="flex items-center justify-center">
                <Image
                  src={profileMd}
                  alt="프로필"
                  width={54}
                  height={54}
                  className="rounded-full"
                />
              </button>
            ) : (
              <Link href="/login" className="p-4">
                <span
                  onClick={() => setIsLoggedIn(true)}
                  className="font-pretendard text-base font-medium text-slate-600 transition-colors hover:text-gray-900"
                >
                  로그인
                </span>
              </Link>
            )}
          </div>

          {/* 3. 모바일 전용 영역 (메뉴 & 사이드바. 로그인 여부 상관없이 항상 렌더링) */}
          <div className="flex items-center justify-center md:hidden">
            <Sheet>
              <SheetTrigger className="flex items-center justify-center">
                <Image src={menu} alt="메뉴" width={24} height={24} />
              </SheetTrigger>
              <SideBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
