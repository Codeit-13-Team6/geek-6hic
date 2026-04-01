interface UserTabSkeletonProps {
  variant?: "meeting" | "post";
}

export function UserTabSkeleton({ variant = "meeting" }: UserTabSkeletonProps) {
  if (variant === "post") {
    return (
      <div className="flex w-full flex-col">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex animate-pulse flex-col gap-6 border-b border-slate-100 py-8 first:pt-0 sm:flex-row sm:gap-10 sm:px-4"
          >
            <div className="aspect-video w-full shrink-0 rounded-2xl bg-slate-100 sm:aspect-square sm:h-40 sm:w-40 lg:h-48 lg:w-48" />

            <div className="flex flex-1 flex-col justify-between py-1">
              <div className="space-y-4">
                <div className="h-3 w-24 rounded bg-slate-100" />
                <div className="h-8 w-3/4 rounded bg-slate-100" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-slate-100" />
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100" />
                  <div className="h-4 w-16 rounded bg-slate-100" />
                </div>
                <div className="h-4 w-20 rounded bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="mb-4 flex animate-pulse flex-col overflow-hidden border border-slate-100 bg-white sm:h-[180px] sm:flex-row sm:items-center sm:gap-8 sm:rounded-3xl sm:px-6"
        >
          <div className="aspect-video w-full shrink-0 bg-slate-100 sm:h-32 sm:w-32 sm:rounded-2xl" />

          <div className="flex flex-1 flex-col p-6 sm:p-0">
            <div className="mb-2 flex items-center justify-between">
              <div className="h-3 w-16 rounded bg-slate-100" />
              <div className="h-6 w-6 rounded bg-slate-100" />
            </div>
            <div className="mb-4 h-8 w-2/3 rounded bg-slate-100" />
            <div className="mt-auto flex items-center gap-6">
              <div className="h-4 w-24 rounded bg-slate-100" />
              <div className="h-4 w-24 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
