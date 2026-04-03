export default function DetailSkeleton() {
  return (
    <div className="w-full sm:px-6  lg:px-22">
      <div className="relative w-full animate-pulse rounded-[32px] bg-white shadow-md shadow-slate-200/30">
        <div className="px-8 pt-10 sm:px-14 lg:px-18 lg:pt-12">
          <div className="absolute top-4 right-4 size-9 rounded-full bg-slate-50 sm:top-5 sm:right-6 lg:top-6 lg:right-7"></div>

          <div className="mb-6 flex max-w-[96%] flex-col gap-3">
            <div className="h-8 w-3/4 rounded-xl bg-slate-100 sm:h-9 lg:h-10"></div>
            <div className="h-8 w-1/2 rounded-xl bg-slate-100 sm:h-9 lg:h-10"></div>
          </div>

          <div className="mb-3 flex items-center gap-3">
            <div className="size-5 shrink-0 rounded-full bg-slate-100"></div>
            <div className="h-4 w-16 rounded-lg bg-slate-100"></div>
            <div className="h-3 w-1 rounded-full bg-slate-50"></div>
            <div className="h-4 w-24 rounded-lg bg-slate-100"></div>
          </div>
        </div>

        <div className="p-8 sm:px-14 lg:px-18 lg:pb-12">
          <div className="mb-12 flex flex-col gap-4">
            <div className="h-4 w-full rounded-lg bg-slate-50"></div>
            <div className="h-4 w-full rounded-lg bg-slate-50"></div>
            <div className="h-4 w-5/6 rounded-lg bg-slate-50"></div>
            <div className="h-4 w-full rounded-lg bg-slate-50"></div>
            <div className="h-4 w-2/3 rounded-lg bg-slate-50"></div>
          </div>

          <div className="mt-12 flex items-center justify-between border-t border-slate-50 pt-6">
            <div className="flex gap-5">
              <div className="h-4 w-16 rounded-lg bg-slate-100"></div>
              <div className="flex gap-3">
                <div className="h-4 w-10 rounded-lg bg-slate-50"></div>
                <div className="h-4 w-10 rounded-lg bg-slate-50"></div>
              </div>
            </div>
            <div className="size-9 rounded-xl bg-slate-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
