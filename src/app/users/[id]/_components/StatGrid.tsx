import { cn } from "@/lib";
import { Ghost, SearchX } from "lucide-react";
import { ParticipantBarChart } from "./ParticipantBarChart";

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
  meetingTypeStats?: {
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
  participantStats,
  meetingTypeStats,
}: StatGridProps) {
  const safeMeetingStats = {
    team: meetingTypeStats?.team || 0,
    study: meetingTypeStats?.study || 0,
    project: meetingTypeStats?.project || 0,
    jobPrep: meetingTypeStats?.jobPrep || 0,
    etc: meetingTypeStats?.etc || 0,
  };

  const safeParticipantStats = {
    team: participantStats?.team || 0,
    study: participantStats?.study || 0,
    project: participantStats?.project || 0,
    jobPrep: participantStats?.jobPrep || 0,
    etc: participantStats?.etc || 0,
  };

  const hasMeetings = meetingCount > 0;
  const totalParticipants = Object.values(safeParticipantStats).reduce(
    (sum, val) => sum + (val || 0),
    0,
  );
  const hasParticipants = totalParticipants > 0;

  return (
    <div className="flex w-[80%] snap-x snap-mandatory flex-row items-stretch gap-4 lg:contents">
      {/* [슬라이드 1] 만든 모임 및 기본 활동 요약 */}
      <div className="flex h-full min-w-full snap-center flex-col lg:min-w-0">
        <div className="mb-3 flex items-center gap-3 px-1 lg:mt-5">
          <div className="h-4 w-[2px] rounded-full bg-slate-950/20" />
          <h2 className="text-sm font-black tracking-[0.2em] text-slate-400 uppercase">
            Activity
          </h2>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          {/* 메인 통계 */}
          <div className="flex flex-1 flex-row items-stretch rounded-3xl border border-slate-100/60 bg-white p-6 shadow-sm md:flex-0">
            {/* [왼쪽 영역] 총 개수 */}
            <div className="flex flex-1 flex-col justify-around border-r border-slate-50 pr-6 sm:justify-between">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-base shadow-inner">
                  🏗️
                </div>
                <span className="text-xs font-bold tracking-tight text-slate-400 uppercase">
                  만든 모임
                </span>
              </div>
              <div className="text-4xl font-black sm:text-5xl">
                <span className="text-slate-950">{meetingCount}</span>
                <span className="ml-1 text-sm font-bold text-slate-300">
                  개
                </span>
              </div>
            </div>
            <div className="h-full w-px bg-slate-100" />
            {/* [오른쪽 영역] 상세 타입 리스트 */}
            <div className="flex flex-1 flex-col justify-center pl-8">
              {hasMeetings ? (
                <div className="flex flex-col gap-2.5">
                  <TypeCountText
                    label="팀미팅"
                    count={safeMeetingStats.team}
                    dotColor="bg-cyan-500"
                  />
                  <TypeCountText
                    label="스터디"
                    count={safeMeetingStats.study}
                    dotColor="bg-indigo-500"
                  />
                  <TypeCountText
                    label="프로젝트"
                    count={safeMeetingStats.project}
                    dotColor="bg-purple-500"
                  />
                  <TypeCountText
                    label="취준생"
                    count={safeMeetingStats.jobPrep}
                    dotColor="bg-rose-500"
                  />
                  <TypeCountText
                    label="기타"
                    count={safeMeetingStats.etc}
                    dotColor="bg-slate-400"
                  />
                </div>
              ) : (
                <div className="my-5 flex flex-1 flex-col items-center justify-center gap-2">
                  <Ghost size={28} className="text-slate-300" />
                  <p className="text-xs leading-relaxed font-medium text-slate-400">
                    아직 주최한 모임이 <br /> 없습니다.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 서브 통계 */}
          <div className="grid shrink-0 grid-cols-2 gap-3">
            <StatBox
              label="작성한 게시글"
              val={postCount}
              icon="✍️"
              color="bg-blue-50/70 shadow-inner"
            />
            <StatBox
              label="받은 좋아요"
              val={favoriteCount}
              icon="💖"
              color="bg-rose-50/80 shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* [슬라이드 2] 참여자 수 분포 차트 */}
      <div className="flex h-full min-w-full snap-center flex-col lg:min-w-0">
        <div className="mb-3 flex items-center gap-3 px-1 lg:mt-5 lg:hidden">
          <div className="h-4 w-[2px] rounded-full bg-transparent" />
          <h2 className="text-sm font-black tracking-[0.2em] text-transparent uppercase opacity-0 select-none">
            ghost text
          </h2>
        </div>

        {/* 차트 카드 */}
        <div className="flex flex-1 flex-col rounded-3xl border border-slate-100/60 bg-white p-5 shadow-sm md:flex-0">
          <div className="mb-2 flex items-center justify-start gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-base shadow-inner">
              👥
            </div>
            <h3 className="text-xs font-bold tracking-tight text-slate-400 uppercase">
              모임 참여 인원
            </h3>
          </div>

          {hasParticipants ? (
            <div className="flex flex-col justify-end gap-3 sm:gap-1">
              <div className="flex flex-1 items-center justify-end gap-3 font-semibold">
                <span className="text-xs text-slate-500">전체</span>
                <span className="text-xl font-black text-slate-950">
                  {totalParticipants}
                  <span className="ml-1 text-[10px] font-bold font-normal text-slate-400">
                    명
                  </span>
                </span>
              </div>
              <div className="h-[130px] w-full shrink-0">
                <ParticipantBarChart stats={safeParticipantStats} />
              </div>
              <div className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-1 py-5 sm:px-3 sm:py-2.5">
                <PartItem
                  label="팀미팅"
                  val={safeParticipantStats.team}
                  color="text-cyan-600"
                />
                <div className="h-4 w-px bg-slate-200" />
                <PartItem
                  label="스터디"
                  val={safeParticipantStats.study}
                  color="text-indigo-500"
                />
                <div className="h-4 w-px bg-slate-200" />
                <PartItem
                  label="프로젝트"
                  val={safeParticipantStats.project}
                  color="text-violet-500"
                />
                <div className="h-4 w-px bg-slate-200" />
                <PartItem
                  label="취준생"
                  val={safeParticipantStats.jobPrep}
                  color="text-rose-400"
                />
                <div className="h-4 w-px bg-slate-200" />
                <PartItem
                  label="기타"
                  val={safeParticipantStats.etc}
                  color="text-slate-500"
                />
              </div>
            </div>
          ) : (
            <div className="my-15 flex flex-1 flex-col items-center justify-center gap-2">
              <SearchX size={48} className="text-slate-300" />
              <p className="text-xs font-bold text-slate-400">
                참여 데이터가 없습니다.
              </p>
              <p className="text-xs font-medium tracking-tight text-slate-300">
                모임을 만들고 참여자를 모아보세요!
              </p>
            </div>
          )}
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
    <dl className="flex flex-1 flex-col items-center justify-center text-center text-[10px] sm:text-xs">
      <dt
        className={cn(
          "mb-0.5 text-[9px] font-black tracking-tighter uppercase",
          color,
        )}
      >
        {label}
      </dt>
      <dd className="text-sm font-black text-slate-900 sm:text-sm">{val}</dd>
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
    <div className="flex h-full flex-col justify-between gap-2 rounded-3xl border border-slate-100/60 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm",
            color,
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
        <dt className="line-clamp-1 text-xs font-bold tracking-tight text-slate-400 uppercase">
          {label}
        </dt>
      </div>
      <dd className="mt-1 text-lg font-black text-slate-900 sm:text-xl">
        {val}
        <span className="ml-1 text-xs font-bold text-slate-300">개</span>
      </dd>
    </div>
  );
}

function TypeCountText({
  label,
  count = 0,
  dotColor,
}: {
  label: string;
  count?: number;
  dotColor: string;
}) {
  if (count === 0) return null;
  return (
    <div className="flex w-full items-center gap-2 text-[12px] font-bold text-slate-700">
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotColor)} />
      <div className="flex flex-1 items-center justify-between">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-950">
          {count}
          <span className="ml-1 text-xs font-bold font-normal text-slate-400">
            개
          </span>
        </span>
      </div>
    </div>
  );
}
