export default function LoungeSkeleton() {
  return (
    <div className="w-full animate-pulse" role="status">
      <section className="mt-8 flex flex-col sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-row items-center gap-3 sm:max-w-[500px]">
          <div className="h-[50px] w-full rounded-full bg-gray-100"></div>
          <div className="size-6 shrink-0 rounded-full bg-gray-100 sm:size-7"></div>
        </div>
        <div className="mt-4 flex w-full justify-end sm:mt-0 sm:w-auto">
          <div className="h-[50px] w-[120px] rounded-[12px] bg-gray-100 sm:w-[140px]"></div>
        </div>
      </section>

      <section className="mt-6 sm:mt-8">
        <div className="flex w-full flex-col gap-6 rounded-[24px] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:gap-8 sm:p-6 md:p-8">
          {[1, 2, 3].map((item) => (
            <article
              key={item}
              className="flex flex-col gap-4 sm:flex-row sm:gap-8"
            >
              <div className="hidden size-40 shrink-0 rounded-[12px] bg-gray-100 sm:block lg:size-50"></div>

              <div className="flex flex-1 flex-col border-b border-slate-100 px-4 pt-4 pb-6 sm:px-2">
                <div className="mb-3 h-5 w-2/3 rounded-md bg-gray-100 sm:mb-2 sm:h-7"></div>

                <div className="mb-4 block aspect-video w-full shrink-0 rounded-[12px] bg-gray-100 sm:hidden"></div>

                <div className="mb-4 flex flex-col gap-2 sm:mb-0">
                  <div className="h-4 w-full rounded-md bg-gray-100 sm:h-5"></div>
                  <div className="h-4 w-4/5 rounded-md bg-gray-100 sm:h-5"></div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <div className="size-6 shrink-0 rounded-full bg-gray-100"></div>
                    <div className="h-3 w-24 rounded-md bg-gray-100 sm:h-4"></div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-3 w-8 rounded-md bg-gray-100 sm:h-4"></div>
                    <div className="h-3 w-8 rounded-md bg-gray-100 sm:h-4"></div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
