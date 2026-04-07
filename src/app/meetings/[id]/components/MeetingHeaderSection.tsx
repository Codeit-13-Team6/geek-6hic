"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // 애니메이션 라이브러리
import Lottie from "lottie-react"; // Lottie 라이브러리
import checkAnim from "@/assets/lottie/check-anim.json"; // 제공받은 Lottie JSON

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

  // --- 애니메이션 전용 상태 ---
  const [showReward, setShowReward] = useState<{
    show: boolean;
    point: number;
  }>({
    show: false,
    point: 0,
  });
  const [isAnimating, setIsAnimating] = useState(false);

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
    if (isAuthLoading || isJoinPending || isActionDisabled || isAnimating)
      return;

    switch (actionState) {
      case "joinable":
        await onJoin();
        return;
      case "attendance_ready":
        // 1. 포인트 랜덤 생성 (1~5점)
        const earnedPoint = Math.floor(Math.random() * 5) + 1;

        // 2. 실제 출석 함수 실행
        await onAttend();

        // 3. 게이미케이션 애니메이션 시작
        setIsAnimating(true);
        setShowReward({ show: true, point: earnedPoint });

        // 4. 일정 시간 후 상태 초기화
        setTimeout(() => {
          setShowReward({ show: false, point: 0 });
          setIsAnimating(false);
        }, 3000);
        return;
      default:
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
        {/* 왼쪽 이미지 섹션 */}
        <div className="relative h-[240px] w-full shrink-0 overflow-hidden rounded-[32px] bg-slate-50 shadow-sm md:h-auto md:w-[320px] xl:w-[540px]">
          <FallbackImage
            src={data.image ?? ""}
            alt={data.name}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* 오른쪽 정보 섹션 */}
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
                    onClick={() => loginGuardAction(onShare)}
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
                      {shouldShowHostMenu && (
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
                      )}
                      {shouldShowParticipantMenu && (
                        <DropdownMenuItem
                          onClick={onCancelJoin}
                          className="font-bold text-red-500"
                        >
                          모임 탈퇴하기
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* 게이지 바 섹션 */}
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

              {/* 애니메이션 게이지 바 */}
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  className="h-full rounded-full bg-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressValue}%` }}
                  transition={{ duration: 1, ease: "circOut" }}
                />
              </div>
            </div>
          </div>

          {/* 하단 버튼 섹션 및 포인트 애니메이션 */}
          <div className="relative mt-5 flex items-center gap-4 sm:mt-10">
            {/* 포인트 팝업 (Framer Motion) */}

            {/* 출석 버튼 */}
            <BtnCommon
              type="button"
              size="md"
              disabled={
                isActionDisabled ||
                isJoinPending ||
                isAuthLoading ||
                isAnimating
              }
              onClick={() => loginGuardAction(handleActionClick)}
              className="bg-main-purple hover:bg-main-purple/80 relative h-16 flex-1 overflow-hidden !rounded-[24px] font-bold tracking-[0.1em] text-white shadow-[0_15px_30px_rgba(38,6,86,0.2)] transition-all active:scale-[0.98]"
            >
              <span
                className={
                  isAnimating ? "opacity-0" : "opacity-100 transition-opacity"
                }
              >
                {isJoinPending ? "PROCESSING..." : actionLabel}
              </span>

              {/* 버튼 클릭 시 내부에 Lottie 체크 애니메이션 표시 */}
              {isAnimating && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lottie
                    animationData={checkAnim}
                    loop={false}
                    className="h-20 w-20" // 버튼 크기에 맞춰 조절
                  />
                </div>
              )}
            </BtnCommon>

            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, right: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  right: 0,
                  y: -50,
                }}
                exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
                className="pointer-events-none z-50 text-white"
              >
                <div
                  className={`flex items-center gap-2 rounded-2xl border-2 border-none bg-none px-6 py-2 text-sm font-bold whitespace-nowrap ${
                    showReward.show ? "text-main-purple" : ""
                  }`}
                >
                  <span>+{showReward.point} Points</span>
                </div>
              </motion.div>
            </AnimatePresence>
            <HeartIcon
              liked={data.isFavorited}
              onClick={() => loginGuardAction(handleFavoriteClick)}
              size={28}
              disabled={isFavoritePending}
            />
          </div>
        </div>
      </section>

      {/* 기존 모달 유지 */}
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
