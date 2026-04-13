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
    <div
      className="grid grid-cols-6 gap-3 md:max-lg:h-full lg:grid-cols-2"
      aria-label="사용자 활동 통계"
    >
      <div className="col-span-6 flex items-center justify-between rounded-3xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
        <dl className="flex flex-col">
          <dt className="text-[10px] font-bold tracking-tight text-slate-400 uppercase sm:text-[11px]">
            만든 모임
          </dt>
          <dd className="text-xl font-black text-slate-900 sm:text-2xl">
            {meetingCount}개
          </dd>
        </dl>
        <div className="text-xl sm:text-2xl" aria-hidden="true">
          🏗️
        </div>
      </div>

      <div className="col-span-3 lg:col-span-1">
        <StatBox
          label="작성한 게시글"
          val={postCount}
          icon="✍️"
          color="bg-blue-50"
        />
      </div>

      <div className="col-span-3 lg:col-span-1">
        <StatBox
          label="받은 좋아요"
          val={favoriteCount}
          icon="💖"
          color="bg-rose-50"
        />
      </div>

      <div className="col-span-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[10px] font-bold tracking-tight text-slate-400 uppercase">
            만든 모임별 참여자 수
          </h3>
          <span className="text-lg" aria-hidden="true">
            👥
          </span>
        </div>

        <div className="flex w-full items-center justify-between gap-1 overflow-x-hidden">
          <PartItem
            label="팀미팅"
            val={participantStats.team}
            color="text-cyan-600"
          />
          <div
            className="h-4 w-px bg-slate-100"
            aria-hidden="true"
          />
          <PartItem
            label="스터디"
            val={participantStats.study}
            color="text-indigo-500"
          />
          <div
            className="h-4 w-px bg-slate-100"
            aria-hidden="true"
          />
          <PartItem
            label="프로젝트"
            val={participantStats.project}
            color="text-violet-500"
          />
          <div
            className="h-4 w-px bg-slate-100"
            aria-hidden="true"
          />
          <PartItem
            label="취준생"
            val={participantStats.jobPrep}
            color="text-rose-400"
          />
          <div
            className="h-4 w-px bg-slate-100"
            aria-hidden="true"
          />
          <PartItem
            label="기타"
            val={participantStats.etc}
            color="text-slate-400"
          />
        </div>
      </div>
    </div>
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
    <dl className="flex flex-1 flex-col items-center justify-center text-center">
      <dt
        className={cn(
          "text-[8px] font-black tracking-tighter uppercase sm:text-[9px]",
          color,
        )}
      >
        {label}
      </dt>
      <dd className="mt-0.5 text-[12px] font-black whitespace-nowrap text-slate-900 sm:text-sm">
        {val}
        <span className="text-[10px] font-medium text-slate-400">명</span>
      </dd>
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

      <dl className="flex flex-col">
        <dt className="text-[10px] leading-tight font-bold text-slate-400 uppercase">
          {label}
        </dt>
        <dd className="mt-0.5 text-lg leading-none font-black text-slate-900">
          {val}
        </dd>
      </dl>
    </div>
  );
}
