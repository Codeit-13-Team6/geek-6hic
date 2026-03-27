export default function CommentSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col gap-4">
      <div className="h-6 w-24 rounded-md bg-gray-200"></div>

      <div className="h-[56px] w-full rounded-[16px] bg-gray-100 sm:h-[66px]"></div>

      <div className="mt-4 flex flex-col divide-y divide-gray-100">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 py-5">
            <div className="size-10 shrink-0 rounded-full bg-gray-100"></div>
            <div className="flex w-full flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-20 rounded-md bg-gray-100"></div>
                <div className="h-3 w-16 rounded-md bg-gray-100"></div>
              </div>
              <div className="h-4 w-full rounded-md bg-gray-100"></div>
              <div className="h-4 w-3/4 rounded-md bg-gray-100"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
