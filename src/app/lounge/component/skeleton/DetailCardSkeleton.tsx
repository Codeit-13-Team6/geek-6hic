export default function DetailSkeleton() {
  return (
    <div className="mb-10 w-full animate-pulse rounded-[24px] bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-4 h-6 w-3/4 rounded-md bg-gray-100 sm:h-8"></div>

      <div className="mb-8 flex items-center gap-3">
        <div className="size-10 shrink-0 rounded-full bg-gray-100"></div>
        <div className="flex flex-col gap-2">
          <div className="h-4 w-24 rounded-md bg-gray-100"></div>
          <div className="h-3 w-32 rounded-md bg-gray-100"></div>
        </div>
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <div className="h-4 w-full rounded-md bg-gray-100"></div>
        <div className="h-4 w-full rounded-md bg-gray-100"></div>
        <div className="h-4 w-5/6 rounded-md bg-gray-100"></div>
        <div className="h-4 w-2/3 rounded-md bg-gray-100"></div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
        <div className="h-10 w-24 rounded-full bg-gray-100"></div>
        <div className="flex gap-3">
          <div className="size-8 rounded-full bg-gray-100"></div>
          <div className="size-8 rounded-full bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}
