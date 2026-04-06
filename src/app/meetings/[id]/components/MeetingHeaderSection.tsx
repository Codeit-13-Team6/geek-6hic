"use client";

import Image from "next/image";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import crownLgIcon from "@/assets/icon/crown/crown-lg.svg";
import meatballsLgIcon from "@/assets/icon/meatballs/meatballs-lg.svg";
import profileFemaleSm from "@/assets/img/profile/female1-sm.jpg";
import { EditMeetingModal } from "@/app/meetings/_components/modal/EditMeetingModal";
import { BtnCommon } from "@/components/ui/BtnCommon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownCommon";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { HeartIcon } from "@/components/icon/HeartIcon";
import FallbackImage from "@/components/img/FallbackImage";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import { Users2 } from "lucide-react";
import { useMeetingDetailMutations } from "@/hooks";
import { QUERY_KEYS } from "@/constans/queryKey";
import type {
  MeetingActionState,
  MeetingHeaderSectionProps,
  MeetingMember,
} from "@/types";

const getActionState = ({
  isLoggedIn,
  isParticipant,
  isCheckingAttendance,
  hasAttended,
}: {
  isLoggedIn: boolean;
  isParticipant: boolean;
  isCheckingAttendance: boolean;
  hasAttended: boolean;
}): MeetingActionState => {
  if (!isLoggedIn) return "guest_join";
  if (!isParticipant) return "joinable";
  if (isCheckingAttendance) return "attendance_checking";
  if (hasAttended) return "attendance_done";
  return "attendance_ready";
};

const getActionUI = ({
  actionState,
  isCapacityFull,
}: {
  actionState: MeetingActionState;
  isCapacityFull: boolean;
}) => {
  switch (actionState) {
    case "guest_join":
      return { label: "참여하기", disabled: false };
    case "joinable":
      return { label: "참여하기", disabled: isCapacityFull };
    case "attendance_checking":
      return { label: "출석 확인 중", disabled: true };
    case "attendance_done":
      return { label: "출석완료", disabled: true };
    case "attendance_ready":
      return { label: "출석하기", disabled: false };
  }
};

const hasUsableProfileImage = (
  value: string | null | undefined,
): value is string =>
  Boolean(value) &&
  !value?.includes("example.com") &&
  !value?.startsWith("blob:");

export function MeetingHeaderSection({
  meetingId,
  data,
  participantAvatars,
}: MeetingHeaderSectionProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const loginGuardAction = useLoginModalStore((s) => s.loginGuardAction);

  const queryClient = useQueryClient();
  const hasAttendedInitially =
    queryClient.getQueryData<boolean>(
      QUERY_KEYS.meetings.attendance(meetingId),
    ) ?? false;

  const {
    isAuthLoading,
    hasAttended,
    isCheckingAttendance,
    joinMutation,
    cancelJoinMutation,
    favoriteMutation,
    attendMutation,
    handleJoinMeeting,
    handleCancelJoinMeeting,
    handleShareMeeting,
    handleEditMeeting,
    handleDeleteMeeting,
    handleToggleFavorite,
    handleAttendMeeting,
  } = useMeetingDetailMutations({ meetingId, initialHasAttended: hasAttendedInitially });

  const isParticipant = data.isHost || data.isJoined;
  const isCapacityFull = data.participantCount >= data.capacity;
  const actionState = getActionState({
    isLoggedIn: data.isLoggedIn,
    isParticipant,
    isCheckingAttendance,
    hasAttended,
  });
  const { label: actionLabel, disabled: isActionDisabled } = getActionUI({
    actionState,
    isCapacityFull,
  });

  const shouldShowShareButton = data.isLoggedIn && isParticipant;
  const shouldShowHostMenu = data.isHost;
  const shouldShowParticipantMenu = data.isJoined && !data.isHost;

  const isJoinPending =
    joinMutation.isPending ||
    cancelJoinMutation.isPending ||
    attendMutation.isPending;

  const progressValue = (data.participantCount / data.capacity) * 100;
  const visibleParticipants =
    participantAvatars.length > 0
      ? participantAvatars.slice(0, 3)
      : [data.host];
  const hiddenParticipantCount = Math.max(
    0,
    data.participantCount - visibleParticipants.length,
  );

  const handleActionClick = async () => {
    if (isAuthLoading || isJoinPending || isActionDisabled) return;

    switch (actionState) {
      case "guest_join":
        return;
      case "joinable":
        await handleJoinMeeting();
        return;
      case "attendance_ready":
        await handleAttendMeeting(data.region);
        return;
      case "attendance_checking":
      case "attendance_done":
        return;
    }
  };

  const handleFavoriteClick = () => {
    if (isAuthLoading || favoriteMutation.isPending) return;
    handleToggleFavorite(data.isFavorited);
  };

  const renderParticipantAvatar = (
    participant: MeetingMember,
    index: number,
  ) => {
    const displayName = participant.name || "참여자";
    const profileImage = hasUsableProfileImage(participant.image)
      ? participant.image
      : profileFemaleSm;

    return (
      <Image
        key={`${participant.id}-${index}`}
        src={profileImage}
        alt={displayName}
        width={36}
        height={36}
        className="size-8 rounded-full border-2 border-white object-cover xl:size-10"
      />
    );
  };

  return (
    <>
      <section className="flex flex-col gap-6 md:flex-row md:items-stretch xl:gap-10">
        <div className="relative h-[240px] w-full shrink-0 overflow-hidden rounded-[32px] bg-slate-50 shadow-sm md:h-auto md:w-[320px] xl:w-[540px]">
          <FallbackImage
            src={data.image ?? ""}
            alt={data.name}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between rounded-[40px] border border-slate-50 bg-white p-8 shadow-[0_30px_60px_rgba(0,0,0,0.04)] xl:p-12">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start gap-3">
                  <h1 className="truncate text-2xl leading-tight font-black tracking-tighter break-keep text-slate-950 sm:text-3xl xl:text-4xl">
                    {data.name}
                  </h1>
                  {data.isHost && (
                    <div className="mt-1 shrink-0 rounded-xl bg-amber-100 p-1.5 shadow-sm">
                      <Image
                        src={crownLgIcon}
                        alt="Host"
                        width={20}
                        height={20}
                        className="xl:size-6"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {shouldShowShareButton && (
                  <BtnCommon
                    type="button"
                    size="sm"
                    variant="teritary"
                    onClick={() => loginGuardAction(handleShareMeeting)}
                    className="!rounded-2xl"
                  >
                    공유
                  </BtnCommon>
                )}

                {(shouldShowHostMenu || shouldShowParticipantMenu) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          type="button"
                          className="group rounded-full p-2 transition hover:bg-slate-50"
                        >
                          <Image
                            src={meatballsLgIcon}
                            alt="Menu"
                            width={28}
                            height={28}
                            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white"
                          />
                        </button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      {shouldShowHostMenu ? (
                        <>
                          <DropdownMenuItem
                            onClick={() => setIsEditModalOpen(true)}
                          >
                            모임 수정하기
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="font-bold text-red-500"
                          >
                            모임 삭제하기
                          </DropdownMenuItem>
                        </>
                      ) : null}

                      {shouldShowParticipantMenu ? (
                        <DropdownMenuItem
                          onClick={handleCancelJoinMeeting}
                          className="font-bold text-red-500"
                        >
                          모임 탈퇴하기
                        </DropdownMenuItem>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            <div className="group relative rounded-[28px] bg-slate-50 p-4 transition-all">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-main-purple flex size-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Users2 size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Participants
                    </p>
                    <p className="text-xl font-black text-slate-950">
                      {data.participantCount}{" "}
                      <span className="text-sm font-bold text-slate-400">
                        / {data.capacity}명
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex -space-x-2.5">
                  {visibleParticipants.map(renderParticipantAvatar)}
                  {hiddenParticipantCount > 0 && (
                    <div className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-black text-slate-500 xl:size-11 xl:text-xs">
                      +{hiddenParticipantCount}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-purple-400 shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-all duration-1000 ease-out"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4 sm:mt-10">
            <BtnCommon
              type="button"
              size="md"
              disabled={isActionDisabled || isJoinPending || isAuthLoading}
              onClick={() => loginGuardAction(handleActionClick)}
              className="bg-main-purple hover:bg-main-purple/80 h-16 flex-1 !rounded-[24px] font-bold tracking-[0.1em] text-white shadow-[0_15px_30px_rgba(38,6,86,0.2)] transition-all active:scale-[0.98]"
            >
              <span className="tracking-widest sm:text-sm">
                {isJoinPending ? "PROCESSING..." : actionLabel}
              </span>
            </BtnCommon>
            <HeartIcon
              liked={data.isFavorited}
              onClick={() => loginGuardAction(handleFavoriteClick)}
              size={28}
              disabled={favoriteMutation.isPending}
            />
          </div>
        </div>
      </section>

      <EditMeetingModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        data={data}
        onSubmit={handleEditMeeting}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="DELETE ARCHIVE"
        description="모임을 정말 삭제하시겠어요?"
        onConfirm={() => {
          handleDeleteMeeting();
          setIsDeleteModalOpen(false);
        }}
      />
    </>
  );
}
