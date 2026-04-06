"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
import ModalBase from "@/components/ui/ModalBase";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/ProgressCommon";
import { TagCommon } from "@/components/ui/TagCommon";
import { MeetingMember, MeetingHeaderSectionProps } from "@/types";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { BellOff, Calendar, Clock, Users2 } from "lucide-react";
import { HeartIcon } from "@/components/icon/HeartIcon";
import FallbackImage from "@/components/img/FallbackImage";

const formatMonthDay = (value: string) => {
  const date = new Date(value);

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const formatHourMinute = (value: string) => {
  const date = new Date(value);

  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const hasUsableProfileImage = (
  value: string | null | undefined,
): value is string =>
  Boolean(value) &&
  !value?.includes("example.com") &&
  !value?.startsWith("blob:");

// ... (formatMonthDay, formatHourMinute, hasUsableProfileImage 함수 유지)

export function MeetingHeaderSection({
  data,
  participantAvatars,
  isFavoritePending,
  isJoinPending,
  isAuthLoading,
  actionLabel,
  isActionDisabled,
  shouldShowHostMenu,
  shouldShowClosedGuide,
  onJoin,
  onCancelJoin,
  onAttend,
  onShare,
  onEdit,
  onDelete,
  onToggleFavorite,
}: MeetingHeaderSectionProps) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoginConfirmOpen, setIsLoginConfirmOpen] = useState(false);

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
    if (isAuthLoading) return;
    if (!data.isLoggedIn) {
      setIsLoginConfirmOpen(true);
      return;
    }
    if (isJoinPending || isActionDisabled) return;
    if (actionLabel === "출석하기") {
      await onAttend();
      return;
    }
    if (data.isHost) {
      await onShare();
      return;
    }
    if (data.isJoined) {
      await onCancelJoin();
      return;
    }
    await onJoin();
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

                {/* 💡 2. 일시 & 메타 정보: 제목 바로 아래에 밀도 있게 배치 */}
                {/* <div className="mt-4 flex flex-wrap items-center gap-2"> */}
                {/* 날짜 태그 */}
                {/* <div className="bg-main-purple/10 text-main-purple flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black tracking-tight shadow-sm">
                    <Calendar size={12} strokeWidth={3} />
                    <span>{formatMonthDay(data.dateTime)}</span>
                  </div> */}

                {/* 시간 태그 */}
                {/* <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black tracking-tight text-slate-600 shadow-sm">
                    <Clock
                      size={12}
                      strokeWidth={3}
                      className="text-main-purple"
                    />
                    <span>{formatHourMinute(data.dateTime)}</span>
                  </div>
                </div> */}
              </div>

              {/* 💡 호스트 전용 메뉴 (버튼 크기 살짝 조정) */}
              {shouldShowHostMenu && (
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
                          className="opacity-40 group-hover:opacity-100"
                        />
                      </button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                      수정하기
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="font-bold text-red-500"
                    >
                      삭제하기
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {/* 💡 세련된 참여 현황 통합 박스 */}
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

              {/* 에메랄드 글로우 프로그레스 바 */}
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-purple-400 shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-all duration-1000 ease-out"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
            </div>
          </div>

          {/* 하단 액션 버튼 영역 */}
          <div className="mt-5 flex items-center gap-4 sm:mt-10">
            <HeartIcon
              liked={data.isFavorited}
              onClick={() => loginGuardAction(handleFavoriteClick)}
              size={28}
              disabled={isFavoritePending}
            />

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
          </div>

          {shouldShowClosedGuide && (
            <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-red-50/50 py-3 text-[11px] font-bold text-red-400">
              <BellOff size={14} />
              모집 마감되어 참여할 수 없습니다.
            </div>
          )}
        </div>
      </section>

      {/* 모달 로직들 유지 */}
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

      <ModalBase
        isOpen={isLoginConfirmOpen}
        onOpenChange={setIsLoginConfirmOpen}
        contentClassName="w-full sm:w-[400px] rounded-[32px] p-8 text-center"
      >
        <div className="flex flex-col items-center py-4">
          <p className="text-2xl font-black tracking-tighter text-slate-950">
            로그인이 필요합니다
          </p>
          <p className="mt-2 text-sm font-medium text-slate-400">
            서비스를 이용하시려면 먼저 로그인해 주세요.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3">
            <BtnCommon
              size="md"
              className="!rounded-2xl bg-slate-950 text-white"
              onClick={() => {
                setIsLoginConfirmOpen(false);
                router.push("/login");
              }}
            >
              로그인 하기
            </BtnCommon>
            <BtnCommon
              variant="teritary"
              size="md"
              className="!rounded-2xl"
              onClick={() => setIsLoginConfirmOpen(false)}
            >
              취소
            </BtnCommon>
          </div>
        </div>
      </ModalBase>
    </>
  );
}
