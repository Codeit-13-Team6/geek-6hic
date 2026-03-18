import Link from "next/link";
import { SheetContent, SheetClose, SheetTitle } from "@/components/shadcnOrigin/sheet";
import { X } from "lucide-react";

const NAV_LINKS = [
  { name: "모임 찾기", href: "/meetings" },
  { name: "나의 모임", href: "/my-meetings" },
  { name: "랭킹 보드", href: "/ranking" },
  { name: "스프린트 라운지", href: "/lounge" },
];

interface SideBarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

// TO DO: 시간 관계상 추후 기능을 붙힐 수 있는 뼈대 ui 구현 -> 필요에 의해 디자인 수정 + 기능 추가
export default function SideBar({ isLoggedIn, setIsLoggedIn }: SideBarProps) {
  return (
    <SheetContent
      side="right"
      className="flex h-full w-[314px] flex-col rounded-l-[20px] bg-white px-5 pt-6 pb-8 sm:max-w-[314px] [&>button.absolute]:hidden"
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
            className="font-pretendard hover:text-main-green-500 text-base font-medium text-slate-600 transition-colors"
          >
            {link.name}
          </Link>
        ))}

        {isLoggedIn && (
          <Link
            href="/mypage"
            className="font-pretendard hover:text-main-green-500 text-base font-medium text-slate-600 transition-colors"
          >
            마이페이지
          </Link>
        )}
      </nav>

      {!isLoggedIn && (
        <div className="mt-auto flex justify-end">
          <Link
            href="/login"
            onClick={() => setIsLoggedIn(true)}
            className="font-pretendard hover:text-main-green-500 text-base font-medium text-slate-400 transition-colors"
          >
            로그인
          </Link>
        </div>
      )}
    </SheetContent>
  );
}
