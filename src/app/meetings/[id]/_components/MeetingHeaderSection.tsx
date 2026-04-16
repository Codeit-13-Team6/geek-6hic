"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import checkAnim from "@/assets/lottie/check-anim.json";
import meatballsLgIcon from "@/assets/icon/meatballs/meatballs-lg.svg";
import { EditMeetingModal } from "@/app/meetings/_components/modal/EditMeetingModal";
import { BtnCommon } from "@/shared/components/ui/BtnCommon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownCommon";
import { DeleteModal } from "@/shared/components/modal/DeleteModal";
import { HeartIcon } from "@/shared/components/icon/HeartIcon";
import FallbackImage from "@/shared/components/img/FallbackImage";
import { useLoginModalStore } from "@/infra/store/useLoginModalStore";
import { ChessQueenIcon, Crown, Lock, Share2Icon, Users2 } from "lucide-react";
import {
  useMeetingJoinMutations,
  useMeetingHostMutations,
  useMeetingAttendMutation,
  useMeetingDetailFavoriteMutation,
} from "@/shared/hooks";
import { useAuthStore } from "@/infra/store/useAuthStore";
import type { MeetingHeaderSectionProps } from "@/shared/types";
import { ToastCommon } from "@/shared/components/ui/ToastCommon";
import {
  extractSecretCode,
  isSecretMeeting,
  verifySecretCode,
} from "@/shared/lib/meetingSecret";
import ModalBase from "@/shared/components/modal/ModalBase";
import { InputCommon } from "@/shared/components/ui/InputCommon";
import { shareLink } from "@/app/meetings/[id]/_lib/share";
import { copyToClipboard } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/shared/components/modal/ConfirmModal";

const hasUsableProfileImage = (value: string | null): value is string =>
  Boolean(value) &&
  !value?.includes("example.com") &&
  !value?.startsWith("blob:");

export function MeetingHeaderSection({
  meetingId,
  detail,
  participants,
  isHost,
  isJoined,
  isLoggedIn,
}: MeetingHeaderSectionProps) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);

  const [secretInput, setSecretInput] = useState("");
  const [secretError, setSecretError] = useState("");

  const [isAnimating, setIsAnimating] = useState(false);
  const [showReward, setShowReward] = useState({
    show: false,
    point: 0,
  });

  const loginGuardAction = useLoginModalStore((s) => s.loginGuardAction);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);

  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);

  const { isJoinPending, handleJoinMeeting, handleCancelJoinMeeting } =
    useMeetingJoinMutations(meetingId);

  const { handleEditMeeting, handleDeleteMeeting } =
    useMeetingHostMutations(meetingId);
  const { hasAttended, isCheckingAttendance, handleAttendMeeting } =
    useMeetingAttendMutation(meetingId);
  const { isFavoritePending, handleToggleFavorite } =
    useMeetingDetailFavoriteMutation(meetingId);

  const handleShare = async () => {
    const shareResult = await shareLink({
      title: detail.name,
      url: window.location.href,
      text: `${detail.name} 모임을 공유해요.`,
    });

    if (shareResult.result === "failed") {
      return ToastCommon({ message: "링크 복사에 실패했어요.", type: "error" });
    }

    if (shareResult.result === "copied-by-app") {
      ToastCommon({
        message: isSecret
          ? "링크 복사 성공! 시크릿 코드와 함께 전달해 보세요."
          : "모임 링크가 복사되었어요.",
        type: "success",
        duration: 3000,
      });
      return;
    }
  };

  const isParticipant = isHost || isJoined;
  const isCapacityFull = detail.participantCount >= detail.capacity;
  const isActionPending = isJoinPending || isCheckingAttendance;

  const menuConfig = {
    showShare: isLoggedIn && isParticipant,
    showHost: isHost,
    showMember: isJoined && !isHost,
  };

  const isSecret = isSecretMeeting(detail.dateTime);

  const action = (() => {
    if (!isLoggedIn) {
      return { label: "참여하기", disabled: false, handler: () => {} };
    }
    if (!isParticipant) {
      return {
        label: "참여하기",
        disabled: isCapacityFull,
        handler: isSecret
          ? () => {
              setSecretInput("");
              setSecretError("");
              setIsSecretModalOpen(true);
            }
          : handleJoinMeeting,
      };
    }
    if (isCheckingAttendance) {
      return { label: "출석 확인 중", disabled: true, handler: () => {} };
    }
    if (hasAttended) {
      return { label: "출석완료", disabled: true, handler: () => {} };
    }
    return {
      label: "출석하기",
      disabled: false,
      handler: () => {
        handleAttendMeeting(detail.region, {
          onSuccess: (result) => {
            setShowReward({
              show: true,
              point: result.attendScore,
            });
            setIsAnimating(true);
          },
        });
      },
    };
  })();

  const progressValue = (detail.participantCount / detail.capacity) * 100;

  const users = participants.map((p) => p.user);
  const visibleParticipants =
    users.length > 0 ? users.slice(0, 3) : [detail.host];
  const hiddenParticipantCount = Math.max(
    0,
    detail.participantCount - visibleParticipants.length,
  );

  const handleFavoriteClick = () => {
    if (isAuthLoading || isFavoritePending) return;
    handleToggleFavorite(detail.isFavorited);
  };

  return (
    <>
      <section className="flex flex-col gap-6 md:flex-row md:items-stretch xl:gap-10">
        <div className="relative h-[240px] w-full shrink-0 overflow-hidden rounded-[32px] bg-slate-50 shadow-sm md:h-auto md:w-[320px] xl:w-[540px]">
          <FallbackImage
            src={detail.image}
            alt="모임 썸네일"
            fill
            className="object-cover transition-transform duration-700"
          />
          {isHost && (
            <div className="absolute top-5 left-5 z-10 shrink-0">
              <div className="flex items-center gap-1.5 rounded-full border-slate-700/50 bg-slate-900/90 p-3 shadow-sm backdrop-blur-md">
                <Crown
                  className="size-4 text-amber-200 sm:size-5"
                  strokeWidth={2.3}
                  aria-hidden="true"
                />
              </div>
            </div>
          )}
          {isSecret && !isJoined && !isHost && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px]">
              <div className="flex flex-col items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-full bg-slate-800/80 shadow-lg ring-1 ring-slate-700/50">
                  <Lock className="size-5 text-slate-300" />
                </div>
                <span className="text-xs font-bold tracking-[0.2em] text-slate-300">
                  SECRET
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between rounded-[40px] border border-slate-50 bg-white p-8 shadow-[0_30px_60px_rgba(0,0,0,0.04)] xl:p-12">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start gap-3">
                  <h1 className="flex items-center gap-2.5 truncate text-2xl leading-tight font-black tracking-tighter break-keep text-slate-950 md:text-3xl">
                    <span className="truncate">{detail.name}</span>
                  </h1>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-0">
                <HeartIcon
                  liked={detail.isFavorited}
                  onClick={() => loginGuardAction(handleFavoriteClick)}
                  size={24}
                  disabled={isFavoritePending}
                />

                {(menuConfig.showHost || menuConfig.showMember) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          type="button"
                          className="group rounded-full p-1.5 transition hover:bg-slate-50"
                        >
                          <Image
                            src={meatballsLgIcon}
                            alt="메뉴 아이콘"
                            width={22}
                            height={22}
                            className="opacity-40 group-hover:opacity-100 sm:size-7"
                          />
                        </button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      {menuConfig.showHost ? (
                        <>
                          <DropdownMenuItem
                            onClick={() => setIsEditModalOpen(true)}
                          >
                            모임 수정하기
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="text-red-500"
                          >
                            모임 삭제하기
                          </DropdownMenuItem>
                        </>
                      ) : null}

                      {menuConfig.showMember ? (
                        <DropdownMenuItem
                          onClick={() => setIsCloseConfirmOpen(true)}
                          className="text-red-500"
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
                      참여 인원
                    </p>
                    <p className="text-xl font-black text-slate-950">
                      {detail.participantCount}{" "}
                      <span className="text-sm font-bold text-slate-400">
                        / {detail.capacity}명
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsParticipantsModalOpen(true)}
                  className="flex -space-x-2.5 rounded-full transition-all hover:scale-105"
                >
                  {visibleParticipants.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="relative size-8 overflow-hidden rounded-full border-2 border-white bg-slate-200"
                    >
                      <FallbackImage
                        src={hasUsableProfileImage(p.image) ? p.image : null}
                        type="user"
                        alt={`${p.name || "참여자"} 프로필`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {hiddenParticipantCount > 0 && (
                    <div className="z-10 flex size-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-black text-slate-500 xl:text-xs">
                      +{hiddenParticipantCount}
                    </div>
                  )}
                </button>
              </div>

              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="bg-main-purple-light h-full rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-all duration-1000 ease-out"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
            </div>
          </div>

          <ModalBase
            isOpen={isParticipantsModalOpen}
            onOpenChange={setIsParticipantsModalOpen}
            title={`참여자 목록 (${detail.participantCount})`}
            contentClassName="max-w-[310px] rounded-[32px]"
            titleClassName="text-lg font-bold mb-5"
          >
            <div className="custom-scrollbar flex max-h-[400px] flex-col gap-2 overflow-y-auto pr-2">
              {participants.map((participant) => (
                <div
                  key={participant.user.id}
                  className="flex items-center justify-between rounded-2xl transition-colors hover:bg-slate-50 sm:py-3"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        router.push(`/users/${participant.user.id}`)
                      }
                      className="relative size-10 overflow-hidden rounded-full border border-slate-100"
                    >
                      <FallbackImage
                        src={
                          hasUsableProfileImage(participant.user.image)
                            ? participant.user.image
                            : null
                        }
                        type="user"
                        alt="프로필"
                        fill
                        className="object-cover"
                      />
                    </button>
                    <span className="text-base font-bold text-slate-700">
                      {participant.user.name || "사용자"}
                    </span>
                  </div>
                  {participant.userId === detail.hostId && (
                    <span className="text-main-purple-point bg-main-purple-light/20 rounded-lg px-2 py-1 text-[10px] font-black">
                      HOST
                    </span>
                  )}
                </div>
              ))}
            </div>
          </ModalBase>
          {isHost && isSecretMeeting(detail.dateTime) && (
            <div className="mt-5 flex items-center justify-between rounded-[20px] bg-purple-50 px-5 py-4">
              <div>
                <p className="text-main-purple-light text-[10px] font-black tracking-widest uppercase">
                  Secret Code
                </p>
                <p className="text-main-purple-point mt-0.5 text-xl font-black tracking-widest">
                  {extractSecretCode(detail.dateTime)}
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const isCopied = await copyToClipboard(
                    extractSecretCode(detail.dateTime),
                  );
                  ToastCommon({
                    message: isCopied
                      ? "비밀 코드가 복사되었어요."
                      : "복사에 실패했습니다.",
                    size: "lg",
                  });
                }}
                className="text-main-purple-point rounded-xl bg-purple-100 px-3 py-2 text-xs font-bold transition hover:bg-purple-200"
              >
                복사
              </button>
            </div>
          )}

          <div className="mt-5 flex items-center gap-4 sm:mt-10">
            <BtnCommon
              type="button"
              size="md"
              disabled={action.disabled || isActionPending || isAuthLoading}
              onClick={() => loginGuardAction(() => void action.handler())}
              className="bg-main-purple hover:bg-main-purple/80 h-16 flex-1 !rounded-[24px] font-bold tracking-[0.1em] text-white shadow-[0_15px_30px_rgba(38,6,86,0.2)] transition-all active:scale-[0.98]"
            >
              <span className="tracking-widest sm:text-sm">
                {isActionPending ? "진행중..." : action.label}
              </span>
            </BtnCommon>
            {menuConfig.showShare && (
              <button
                type="button"
                onClick={() => loginGuardAction(handleShare)}
                className="group rounded-full p-2 transition hover:bg-slate-50"
              >
                <Share2Icon className="h-6 w-6 opacity-20 group-hover:opacity-70" />
              </button>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-0 left-0 z-[999] flex items-start justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="mx-4 flex w-full max-w-[320px] flex-col items-center rounded-[32px] bg-white px-8 py-10 shadow-2xl"
            >
              <Lottie
                animationData={checkAnim}
                loop={false}
                className="h-28 w-28"
                onComplete={() => {
                  setIsAnimating(false);
                  setShowReward({
                    show: false,
                    point: 0,
                  });
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.25 }}
                className="mt-2 text-center"
              >
                <p className="text-lg font-black text-slate-900">출석 완료</p>
                <p className="text-main-purple mt-2 text-base font-bold">
                  +{showReward.point} 포인트
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <EditMeetingModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        detail={detail}
        onSubmit={handleEditMeeting}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        description="모임을 정말 삭제하시겠어요?"
        onConfirm={() => {
          handleDeleteMeeting();
          setIsDeleteModalOpen(false);
        }}
      />

      <ModalBase
        isOpen={isSecretModalOpen}
        onOpenChange={(open) => {
          setIsSecretModalOpen(open);
          if (!open) {
            setSecretInput("");
            setSecretError("");
          }
        }}
        title="비밀 모임 참여"
        contentClassName="max-w-[400px] rounded-[32px]"
      >
        <div className="flex flex-col gap-5 pb-4">
          <p className="text-sm text-slate-500">
            호스트에게 비밀 코드를 받아 입력해 주세요.
          </p>
          <InputCommon
            label="비밀 코드"
            placeholder="비밀 코드를 입력해 주세요"
            value={secretInput}
            onChange={(e) => {
              setSecretInput(e.target.value);
              setSecretError("");
            }}
            isDestructive={Boolean(secretError)}
            hintText={secretError}
          />
          <BtnCommon
            type="button"
            size="md"
            disabled={isJoinPending || !secretInput}
            onClick={() => {
              if (!verifySecretCode(secretInput, detail.dateTime)) {
                setSecretError("비밀 코드가 올바르지 않아요.");
                return;
              }
              setIsSecretModalOpen(false);
              handleJoinMeeting();
            }}
            className="bg-main-purple hover:bg-main-purple/80 h-14 w-full !rounded-[20px] font-bold text-white"
          >
            참여하기
          </BtnCommon>
        </div>
      </ModalBase>

      <ConfirmModal
        isOpen={isCloseConfirmOpen}
        onOpenChange={setIsCloseConfirmOpen}
        onConfirm={() => setIsCloseConfirmOpen(false)}
        onCancel={() => {
          setIsCloseConfirmOpen(false);
          handleCancelJoinMeeting();
        }}
        description="모임에서 탈퇴하시겠습니까?"
        subDescription=""
        confirmButtonLabel="취소하기"
        cancelButtonLabel="탈퇴하기"
      />
    </>
  );
}
