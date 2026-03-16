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

          {/* 네비게이션 링크 영역 */}
          <nav className="hidden items-center md:flex md:gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-pretendard text-base font-medium text-slate-600 transition-colors hover:text-gray-900 md:p-4"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* 우측 로그인/프로필 영역 */}
        <div className="flex h-full items-center justify-center">
          {isLoggedIn ? (
            // [로그인 상태]
            <div className="flex gap-4 md:gap-6">
              <button>
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

              <button>
                <Image
                  src={menu}
                  alt="메뉴"
                  width={24}
                  height={24}
                  className="block md:hidden"
                />

                <Image
                  src={profileMd}
                  alt="프로필"
                  width={54}
                  height={54}
                  className="hidden md:block"
                />
              </button>
            </div>
          ) : (
            // [비로그인 상태]
            <Link href="/login" className="md:p-4">
              <Image
                src={menu}
                alt="메뉴"
                width={24}
                height={24}
                className="block md:hidden"
              />
              <span
                onClick={() => setIsLoggedIn(true)}
                className="font-pretendard hidden text-base font-medium text-slate-600 transition-colors hover:text-gray-900 md:block"
              >
                로그인
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
