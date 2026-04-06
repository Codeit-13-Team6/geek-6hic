export default function MeetingCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-3xl sm:flex sm:items-center sm:gap-5 sm:rounded-[32px] sm:bg-white sm:p-6"
        >
          {/* 이미지 */}
          <div className="h-39 w-full bg-gray-100 sm:h-[170px] sm:w-[170px] sm:shrink-0 sm:rounded-3xl" />

          {/* 콘텐츠 */}
          <div className="flex flex-1 flex-col bg-white p-4 sm:p-0">
            {/* 제목 + 타입 */}
            <div className="flex flex-col gap-2">
              <div className="h-6 w-3/4 rounded-md bg-gray-100" />
              <div className="h-4 w-1/3 rounded-md bg-gray-100" />
            </div>

            {/* 날짜 태그 */}
            <div className="mt-[14px] flex gap-2 sm:mt-10">
              <div className="h-7 w-16 rounded-lg bg-gray-100" />
              <div className="h-7 w-14 rounded-lg bg-gray-100" />
            </div>

            {/* 프로그레스바 */}
            <div className="mt-5 flex w-full items-center">
              <div className="size-4 shrink-0 rounded-full bg-gray-100" />
              <div className="ml-[5px] h-2 w-full rounded-full bg-gray-100" />
              <div className="ml-[13px] h-4 w-10 rounded-md bg-gray-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
