export default function CommentSkeleton() {
  return (
    <div className="mt-4 flex w-full animate-pulse flex-col gap-6 px-2 sm:px-6 lg:px-22">
      <div className="flex items-center gap-2">
        <div className="h-7 w-24 rounded-xl bg-slate-200"></div>
        <div className="h-6 w-10 rounded-full bg-slate-100"></div>
      </div>

      <div className="h-28 w-full rounded-2xl bg-slate-50/80"></div>

      <div className="mt-4 flex flex-col divide-y divide-slate-100">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-6 shrink-0 rounded-full bg-slate-100"></div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="h-4 w-20 rounded-lg bg-slate-100"></div>
                  <div className="h-3 w-24 rounded-lg bg-slate-50"></div>
                </div>
              </div>
            </div>

            <div className="mt-2.5 flex flex-col gap-2 pl-8.5">
              <div className="h-4 w-full rounded-lg bg-slate-50"></div>
              <div className="h-4 w-2/3 rounded-lg bg-slate-50"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
