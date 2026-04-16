import Link from "next/link";
import FallbackImage from "@/components/ui/FallbackImage";
import { getSessionUser } from "@/lib/auth/sessionUser.server";
import GnbNavClient from "./GnbNavClient";
import GnbActionsClient from "./GnbActionsClient";

export async function Gnb() {
  const user = await getSessionUser();
  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-[100] flex h-16 w-full items-center justify-center border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl transition-all md:h-18 2xl:px-0">
      <div className="flex h-full w-full max-w-[1280px] items-center justify-between">
        <div className="flex items-center gap-10 lg:gap-14">
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-black active:scale-95"
          >
            <span className="text-main-purple text-2xl font-black tracking-tighter sm:text-3xl">
              co-git.
            </span>
          </Link>

          <GnbNavClient />
        </div>

        <div className="flex h-full items-center gap-0 sm:gap-2 md:gap-4">
          {isLoggedIn ? (
            <>
              <GnbActionsClient isLoggedIn={isLoggedIn} mode="bell" />
              {user ? (
                <Link
                  className="relative hidden h-6 w-6 cursor-pointer items-center justify-center overflow-hidden rounded-xl transition-all hover:opacity-80 active:scale-95 md:flex"
                  href={`/users/${user.id}`}
                  aria-label="프로필 페이지 이동"
                >
                  <FallbackImage
                    src={user.image}
                    type="user"
                    alt="유저 프로필"
                    fill
                    className="object-cover"
                  />
                </Link>
              ) : null}
              <div className="mx-1 hidden h-3 w-[1px] bg-slate-200 md:block" />
              <GnbActionsClient isLoggedIn={isLoggedIn} mode="logout" />
            </>
          ) : (
            <GnbActionsClient isLoggedIn={isLoggedIn} mode="full" />
          )}
        </div>
      </div>
    </header>
  );
}
