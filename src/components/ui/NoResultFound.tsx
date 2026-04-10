import { SearchX } from "lucide-react";

export function NoResultFound() {
  return (
    <div className="flex flex-col items-center justify-center border-t border-slate-100 py-32">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-slate-50">
        <SearchX className="size-10 text-slate-200" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
        No Results found.
      </h3>
      <p className="mt-2 text-sm font-medium text-slate-400">
        다른 키워드로 검색해보세요.
      </p>
    </div>
  );
}
