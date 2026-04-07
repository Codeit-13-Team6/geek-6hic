import { cn } from "@/lib/utils";

interface StatGridProps {
  postCount: number;
  meetingCount: number;
  favoriteCount: number;
}

export default function StatGrid({
  postCount = 0,
  meetingCount = 0,
  favoriteCount = 0,
}: StatGridProps) {
  return (
    // md(태블릿)까지는 6열 그리드로 설정하여 3:3(1행), 2:2:2(2행) 배치를 가능하게 함
    // lg(데스크탑)에서는 다시 2열로 복귀
    <div className="grid grid-cols-6 gap-3 lg:grid-cols-2">
      {/* --- 1행 (첫 번째 줄) --- */}
      {/* 1. Created Meetings (모바일/태블릿: 3칸 차지 / 데스크탑: 2칸 전체) */}
      <div className="col-span-3 flex items-center justify-between rounded-3xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-tight text-slate-400 uppercase sm:text-[11px]">
            Created Meetings
          </span>
          <span className="text-xl font-black text-slate-900 sm:text-2xl">
            {meetingCount}개
          </span>
        </div>
        <div className="text-xl sm:text-2xl">🏗️</div>
      </div>

      {/* 2. Posts (모바일/태블릿: 3칸 차지 / 데스크탑: 1칸) */}
      <div className="col-span-3 lg:col-span-1">
        <StatBox label="Posts" val={postCount} icon="✍️" color="bg-blue-50" />
      </div>

      {/* --- 2행 (두 번째 줄) --- */}
      {/* 3. Favorites (모바일/태블릿: 2칸 차지 / 데스크탑: 1칸) */}
      <div className="col-span-2 lg:col-span-1">
        <StatBox
          label="Favs"
          val={favoriteCount}
          icon="💖"
          color="bg-rose-50"
        />
      </div>

      {/* 4. Comments (모바일/태블릿: 2칸 차지 / 데스크탑: 1칸) */}
      <div className="col-span-2 lg:col-span-1">
        <StatBox
          label="Comments"
          val={postCount}
          icon="🔖"
          color="bg-green-50"
        />
      </div>

      {/* 5. Participants (모바일/태블릿: 2칸 차지 / 데스크탑: 1칸) */}
      <div className="col-span-2 lg:col-span-1">
        <StatBox
          label="Parts"
          val={favoriteCount}
          icon="👥"
          color="bg-yellow-50"
        />
      </div>
    </div>
  );
}

function StatBox({
  label,
  val,
  icon,
  color,
}: {
  label: string;
  val: number;
  icon: string;
  color: string;
}) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-xl text-sm",
          color,
        )}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] leading-tight font-bold text-slate-400 uppercase">
          {label}
        </span>
        <span className="mt-0.5 text-lg leading-none font-black text-slate-900">
          {val}
        </span>
      </div>
    </div>
  );
}
