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
    <header className="sticky top-0 z-50 flex h-12 w-full items-center justify-center border-b border-gray-200 bg-white px-5 sm:h-22 sm:px-10">
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

          <nav className="hidden items-center sm:flex sm:gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-pretendard hover:text-main-green-600 font-medium whitespace-nowrap text-slate-600 transition-all hover:font-semibold sm:px-2 sm:py-4 sm:text-base lg:px-4"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex h-full items-center justify-center gap-4 sm:gap-3 lg:gap-6">
          {isLoggedIn && (
            <button className="flex items-center justify-center">
              <Image
                src={bellIconSm}
                alt="알림"
                width={20}
                height={20}
                className="block sm:hidden"
              />
              <Image
                src={bellIconLg}
                alt="알림"
                width={24}
                height={24}
                className="hidden sm:block"
              />
            </button>
          )}

          <div className="hidden sm:block">
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
                  className="font-pretendard text-base font-medium whitespace-nowrap text-slate-600 transition-colors hover:text-gray-900"
                >
                  로그인
                </span>
              </Link>
            )}
          </div>

          <div className="flex items-center justify-center sm:hidden">
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
