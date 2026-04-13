export default function ProfileSectionSkeleton() {
  return (
    <article className="flex h-full w-full flex-col items-center gap-6 rounded-[40px] border border-slate-100 bg-white p-8 shadow-sm sm:flex-row sm:gap-8 md:max-lg:min-h-90 lg:flex-col lg:p-8">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-full ring-4 ring-slate-100 sm:size-20 lg:size-24">
        <div className="h-full w-full animate-pulse rounded-full bg-slate-200/70" />
      </div>

      <div className="flex w-full flex-1 flex-col items-center gap-3 sm:items-start lg:items-center">
        <div className="flex flex-col items-center gap-2 sm:items-start lg:items-center">
          <div className="h-8 w-36 animate-pulse rounded-md bg-slate-200/70 sm:h-9" />
        </div>

        <div className="h-px w-full bg-slate-50" />

        <div className="w-full space-y-3 text-center sm:text-left lg:text-center">
          <div className="space-y-1.5">
            <div className="mx-auto h-2.5 w-14 animate-pulse rounded bg-slate-200/60 sm:mx-0 lg:mx-auto" />
            <div className="mx-auto h-4 w-4/5 animate-pulse rounded bg-slate-200/70 sm:mx-0 lg:mx-auto" />
          </div>

          <div className="space-y-1.5">
            <div className="mx-auto h-2.5 w-10 animate-pulse rounded bg-slate-200/60 sm:mx-0 lg:mx-auto" />
            <div className="mx-auto h-4 w-3/4 animate-pulse rounded bg-slate-200/70 sm:mx-0 lg:mx-auto" />
          </div>
        </div>
      </div>
    </article>
  );
}