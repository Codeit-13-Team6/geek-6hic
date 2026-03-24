"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { EmptyData } from "@/components/features/empty/EmptyData";
import savedLg from "@/assets/img/head/saved-lg.jpg";
import savedSm from "@/assets/img/head/saved-sm.jpg";
import { useMeetingQuery } from "@/hooks/useMeetingQuery";

export default function Page() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useMeetingQuery();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 2. 바닥 센서가 화면에 들어왔을 때 실행할 로직
    const observer = new IntersectionObserver(
      (entries) => {
        // 화면에 보이고(isIntersecting) + 다음 데이터가 있고 + 지금 로딩 중이 아닐 때만!
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage(); // <--- 여기서 훅의 기능을 실행시킵니다.
        }
      },
      { threshold: 1.0 }, // 센서가 완전히 보여야 실행
    );

    // 3. 센서 관찰 시작
    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect(); // 정리
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  const allMeetings = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="w-full bg-gray-50 pt-6 pb-20 sm:pt-10 lg:pt-[48px]">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-[56px] shrink-0 items-center justify-center sm:mr-2 sm:size-[102px]">
              <Image
                src={savedSm}
                alt="저장된 모임 아이콘"
                className="block size-[56px] object-contain mix-blend-multiply sm:hidden"
              />
              <Image
                src={savedLg}
                alt="저장된 모임 아이콘"
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

      <section className="mt-10 min-h-[calc(100vh-220px)]">
        {status === "pending" ? (
          <div className="flex min-h-[calc(100vh-220px)] items-center justify-center text-center">
            <p>데이터를 불러오고 있어요...</p>
          </div>
        ) : allMeetings.length === 0 ? (
          <div className="flex min-h-[calc(100vh-220px)] items-center justify-center">
            <EmptyData variant="myMeeting" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex flex-col gap-2 rounded-xl border bg-white p-6 shadow-sm"
                >
                  <div className="relative h-40 w-full overflow-hidden rounded-lg">
                    <img
                      src={meeting.image}
                      alt={meeting.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h2 className="mt-2 text-lg font-bold">{meeting.name}</h2>
                  <p className="text-sm text-gray-500">
                    {meeting.region} | {meeting.type}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(meeting.dateTime).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
            <section>
              <div
                ref={bottomRef}
                className="flex h-20 w-full items-center justify-center"
              >
                {isFetchingNextPage && <p>데이터를 더 불러오고 있어요...</p>}
                {!hasNextPage && allMeetings.length > 0 && (
                  <p>모든 모임을 다 확인하셨습니다! ✔️</p>
                )}
              </div>
            </section>
          </>
        )}
      </section>
    </div>
  );
}
