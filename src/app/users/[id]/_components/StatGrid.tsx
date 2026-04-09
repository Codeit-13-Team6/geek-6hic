import { cn } from "@/lib/utils";

interface StatGridProps {
  postCount: number;
  meetingCount: number;
  favoriteCount: number;
  participantStats?: {
    team?: number;
    study?: number;
    project?: number;
    jobPrep?: number;
    etc?: number;
  };
}

export default function StatGrid({
  postCount = 0,
  meetingCount = 0,
  favoriteCount = 0,
  participantStats = { team: 0, study: 0, project: 0, jobPrep: 0, etc: 0 },
}: StatGridProps) {
  return (
    <dl
      className="grid grid-cols-6 gap-3 lg:grid-cols-2"
      aria-label="사용자 활동 통계"
    >
      <div className="col-span-6 flex items-center justify-between rounded-3xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
        <div className="flex flex-col">
          <dt className="text-[10px] font-bold tracking-tight text-slate-400 uppercase sm:text-[11px]">
            Created Meetings
          </dt>
          <dd className="text-xl font-black text-slate-900 sm:text-2xl">
            {meetingCount}개
          </dd>
        </div>
        <div className="text-xl sm:text-2xl" aria-hidden="true">
          🏗️
        </div>
      </div>

      <div className="col-span-3 lg:col-span-1">
        <StatBox label="Posts" val={postCount} icon="✍️" color="bg-blue-50" />
      </div>

      <div className="col-span-3 lg:col-span-1">
        <StatBox
          label="Favs"
          val={favoriteCount}
          icon="💖"
          color="bg-rose-50"
        />
      </div>

      <div className="col-span-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <dt className="text-[10px] font-bold tracking-tight text-slate-400 uppercase">
            Participant Stats
          </dt>
          <span className="text-lg" aria-hidden="true">
            👥
          </span>
        </div>

        <div className="flex w-full items-center justify-between gap-1 overflow-x-hidden">
          <PartItem
            label="Team"
            val={participantStats.team}
            color="text-cyan-600"
          />
          <div className="h-4 w-[1px] bg-slate-100" />
          <PartItem
            label="Study"
            val={participantStats.study}
            color="text-indigo-500"
          />
          <div className="h-4 w-[1px] bg-slate-100" />
          <PartItem
            label="Project"
            val={participantStats.project}
            color="text-violet-500"
          />
          <div className="h-4 w-[1px] bg-slate-100" />
          <PartItem
            label="Job"
            val={participantStats.jobPrep}
            color="text-rose-400"
          />
          <div className="h-4 w-[1px] bg-slate-100" />
          <PartItem
            label="Etc"
            val={participantStats.etc}
            color="text-slate-400"
          />
        </div>
      </div>
    </dl>
  );
}

function PartItem({
  label,
  val = 0,
  color,
}: {
  label: string;
  val?: number;
  color: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <span
        className={cn(
          "text-[8px] font-black tracking-tighter uppercase sm:text-[9px]",
          color,
        )}
      >
        {label}
      </span>
      <dd className="mt-0.5 text-[12px] font-black whitespace-nowrap text-slate-900 sm:text-sm">
        {val}
        <span className="text-[10px] font-medium text-slate-400">명</span>
      </dd>
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
