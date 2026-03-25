import Image from "next/image";

import savedLg from "@/assets/img/head/saved-lg.jpg";
import savedSm from "@/assets/img/head/saved-sm.jpg";

import MyMeetingsClient from "./MyMeetingsClient";

export default function Page() {
  return (
    <div className="w-full bg-gray-50 pt-6 pb-20 sm:pt-10 lg:pt-[48px]">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-[56px] shrink-0 items-center justify-center sm:mr-2 sm:size-[102px]">
              <Image
                src={savedSm}
                alt="나의 모임"
                className="block size-[56px] object-contain mix-blend-multiply sm:hidden"
              />
              <Image
                src={savedLg}
                alt="나의 모임"
                className="hidden size-[102px] object-contain mix-blend-multiply sm:block"
              />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-gray-900 sm:text-[24px] lg:text-[32px]">
                나의 모임
              </h1>
              <p className="mt-1 text-base font-medium text-gray-500 sm:text-lg lg:text-xl">
                내가 참여한 모임을 확인해보세요 👀
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto mt-10 min-h-[calc(100vh-220px)] w-full max-w-[1280px]">
        <MyMeetingsClient />
      </section>
    </div>
  );
}
