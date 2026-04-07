"use client";

import Image from "next/image";
import { useState } from "react";
import crownLgIcon from "@/assets/icon/crown/crown-lg.svg";
import meatballsLgIcon from "@/assets/icon/meatballs/meatballs-lg.svg";
import shareIcon from "@/assets/icon/share/share.svg";
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
import { MeetingHeaderSectionProps, MeetingMember } from "@/types";

const hasUsableProfileImage = (
  value: string | null | undefined,
): value is string =>
  Boolean(value) &&
  !value?.includes("example.com") &&
  !value?.startsWith("blob:");

export function MeetingHeaderSection({
  data,
  participantAvatars,
  isFavoritePending,
  isJoinPending,
  isAuthLoading,
  actionState,
  actionLabel,
  isActionDisabled,
  shouldShowShareButton,
  shouldShowHostMenu,
  shouldShowParticipantMenu,
  onJoin,
  onCancelJoin,
  onAttend,
  onShare,
  onEdit,
  onDelete,
  onToggleFavorite,
}: MeetingHeaderSectionProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const loginGuardAction = useLoginModalStore((s) => s.loginGuardAction);

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
        await onJoin();
        return;
      case "attendance_ready":
        await onAttend();
        return;
      case "attendance_done":
        return;
    }
  };

  const handleFavoriteClick = () => {
    if (isAuthLoading || isFavoritePending) return;
    onToggleFavorite();
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

              <div className="flex shrink-0 items-center gap-1">
                {shouldShowShareButton && (
                  <button
                    type="button"
                    onClick={() => loginGuardAction(onShare)}
                    className="group rounded-full p-2 transition hover:bg-slate-50"
                  >
                    <Image
                      src={shareIcon}
                      alt="Share"
                      width={22}
                      height={22}
                      className="opacity-40 group-hover:opacity-100 sm:size-7"
                    />
                  </button>
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
                            width={22}
                            height={22}
                            className="opacity-40 group-hover:opacity-100 sm:size-7"
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
                          onClick={onCancelJoin}
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
              disabled={isFavoritePending}
            />
          </div>
        </div>
      </section>

      <EditMeetingModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        data={data}
        onSubmit={onEdit}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="DELETE ARCHIVE"
        description="모임을 정말 삭제하시겠어요?"
        onConfirm={() => {
          onDelete();
          setIsDeleteModalOpen(false);
        }}
      />
    </>
  );
}
