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
    <dl
      className="grid grid-cols-6 gap-3 lg:grid-cols-2"
      aria-label="사용자 활동 통계"
    >
      <div className="col-span-3 flex items-center justify-between rounded-3xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
        <div className="flex flex-col">
          <dt className="text-[10px] font-bold tracking-tight text-slate-400 uppercase sm:text-[11px]">
            Created Meetings
          </dt>
          <dd className="text-xl font-black text-slate-900 sm:text-2xl">
            {meetingCount}개
          </dd>
        </div>
        <div
          className="text-xl sm:text-2xl"
          aria-hidden="true"
        >
          🏗️
        </div>
      </div>

      <div className="col-span-3 lg:col-span-1">
        <StatBox label="Posts" val={postCount} icon="✍️" color="bg-blue-50" />
      </div>

      <div className="col-span-2 lg:col-span-1">
        <StatBox
          label="Favs"
          val={favoriteCount}
          icon="💖"
          color="bg-rose-50"
        />
      </div>

      <div className="col-span-2 lg:col-span-1">
        <StatBox
          label="Comments"
          val={postCount}
          icon="🔖"
          color="bg-green-50"
        />
      </div>

      <div className="col-span-2 lg:col-span-1">
        <StatBox
          label="Parts"
          val={favoriteCount}
          icon="👥"
          color="bg-yellow-50"
        />
      </div>
    </dl>
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
        aria-hidden="true"
      >
        {icon}
      </div>

      <div className="flex flex-col">
        <dt className="text-[10px] leading-tight font-bold text-slate-400 uppercase">
          {label}
        </dt>
        <dd className="mt-0.5 text-lg leading-none font-black text-slate-900">
          {val}
        </dd>
      </div>
    </div>
  );
}