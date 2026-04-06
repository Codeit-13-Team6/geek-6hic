"use client";

import { AlertCircle, AlignLeft } from "lucide-react";
import { MeetingHeaderSection } from "@/app/meetings/[id]/components/MeetingHeaderSection";
import { MeetingLinkSection } from "@/app/meetings/[id]/components/MeetingLinkSection";
import { MeetingThreadSection } from "@/app/meetings/[id]/components/MeetingThreadSection";
import { RecommendedMeetingsSection } from "@/app/meetings/[id]/components/RecommendedMeetingsSection";
import { useMeetingDetailQueries } from "@/hooks";
import { useAuthStore } from "@/store/useAuthStore";
import type {
  MeetingDetailApiData,
  MeetingDetailContentProps,
  MeetingDetailData,
  MeetingParticipant,
  User,
} from "@/types";
import { cn } from "@/lib/utils";

const toMeetingDetailViewModel = ({
  detail,
  participants,
  user,
}: {
  detail: MeetingDetailApiData;
  participants: MeetingParticipant[];
  user: User | null;
}) => {
  const isLoggedIn = Boolean(user);
  const isHost = user?.id === detail.hostId || user?.id === detail.host?.id;
  const isJoined =
    isHost ||
    (isLoggedIn &&
      (detail.isJoined || participants.some((p) => p.userId === user?.id)));
  const isParticipantMember = isLoggedIn && (isHost || isJoined);

  const data: MeetingDetailData = {
    ...detail,
    link: detail.address,
    isHost,
    isJoined,
    isLoggedIn,
    threads: [],
    recommendedMeetings: [],
  };

  return {
    data,
    participantAvatars: participants.map((p) => p.user),
    isParticipantMember,
    linkGuideText: isLoggedIn
      ? "모임에 참여하면 링크를 확인할 수 있어요."
      : "로그인 후 모임에 참여하면 링크를 확인할 수 있어요.",
    threadGuideText: isLoggedIn
      ? "모임에 참여하면 스레드를 작성할 수 있어요."
      : "로그인 후 모임에 참여하면 스레드를 작성할 수 있어요.",
  };
};

export function MeetingDetailContent({ meetingId }: MeetingDetailContentProps) {
  const user = useAuthStore((s) => s.user);
  const { detailQuery, participantsQuery } = useMeetingDetailQueries(meetingId);

  const detail = detailQuery.data;
  const participants = participantsQuery.data?.data ?? [];

  if (detailQuery.isLoading || !detail) {
    return (
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-[32px] border border-slate-50 bg-white p-12 shadow-sm">
        <div className="bg-main-purple/10 flex size-12 animate-pulse items-center justify-center rounded-full">
          <div className="bg-main-purple size-3 rounded-full" />
        </div>
        <p className="mt-4 text-sm font-bold tracking-tight text-slate-400">
          ARCHIVE LOADING...
        </p>
      </div>
    );
  }

  if (detailQuery.isError) {
    return (
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-[32px] border border-red-50 bg-red-50/30 p-12 text-center shadow-sm">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-red-100/50 text-red-500">
          <AlertCircle size={32} strokeWidth={2.5} />
        </div>
        <p className="text-lg font-black tracking-tighter text-slate-950">
          정보를 불러올 수 없습니다.
        </p>
        <p className="mt-2 text-sm font-medium text-slate-400">
          잠시 후 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  const viewModel = toMeetingDetailViewModel({ detail, participants, user });

  return (
    <div className="animate-fade-up flex w-full flex-col gap-10 sm:gap-12 lg:gap-14">
      <MeetingHeaderSection
        meetingId={meetingId}
        data={viewModel.data}
        participantAvatars={viewModel.participantAvatars}
      />

      <section className="w-full space-y-6">
        <div className="flex flex-col gap-1 px-2">
          <div className="text-main-purple flex items-center gap-2">
            <AlignLeft size={18} strokeWidth={3} />
            <h2 className="text-xl font-black tracking-tighter text-slate-950 sm:text-2xl">
              모임 설명
            </h2>
          </div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">
            Archive Description
          </p>
        </div>

        <div
          className={cn(
            "relative overflow-hidden rounded-[32px] border border-slate-50 bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.03)] shadow-sm",
            "md:p-10 xl:rounded-[40px]",
          )}
        >
          <div className="bg-main-purple/5 absolute -top-10 -right-10 size-40 rounded-full blur-3xl" />
          <div className="relative z-10 text-[15px] leading-[1.8] font-medium whitespace-pre-wrap text-slate-600 sm:text-base sm:leading-[1.9] xl:text-[17px]">
            {detail.description}
          </div>
        </div>
      </section>

      <MeetingLinkSection
        link={detail.address}
        canViewLink={viewModel.isParticipantMember}
        guideText={viewModel.linkGuideText}
      />

      <MeetingThreadSection
        meetingId={detail.id}
        canWriteThread={viewModel.isParticipantMember}
        guideText={viewModel.threadGuideText}
      />

      <RecommendedMeetingsSection data={viewModel.data} />
    </div>
  );
}
