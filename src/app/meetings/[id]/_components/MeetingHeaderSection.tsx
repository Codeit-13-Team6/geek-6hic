"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import checkAnim from "@/assets/lottie/check-anim.json";
import meatballsLgIcon from "@/assets/icon/meatballs/meatballs-lg.svg";
import { EditMeetingModal } from "@/app/meetings/_components/modal/EditMeetingModal";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import { DeleteModal } from "@/components/modal/DeleteModal";
import { HeartIcon } from "@/components/ui/HeartIcon";
import FallbackImage from "@/components/ui/FallbackImage";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import {
  ChessQueenIcon,
  Crown,
  Lock,
  LockKeyholeIcon,
  Share2Icon,
  Users2,
} from "lucide-react";
import {
  useMeetingJoinMutations,
  useMeetingHostMutations,
  useMeetingAttendMutation,
  useMeetingDetailFavoriteMutation,
} from "@/app/meetings/[id]/_hooks/useMeetingDetail";
import { useAuthStore } from "@/store/useAuthStore";
import type { MeetingHeaderSectionProps } from "@/types";
import { Toast } from "@/components/ui/Toast";
import {
  extractSecretCode,
  isSecretMeeting,
  verifySecretCode,
} from "@/lib/meetingSecret";
import ModalBase from "@/components/modal/ModalBase";
import { Input } from "@/components/ui/Input";
import { shareLink } from "@/app/meetings/[id]/_lib/share";
import { copyToClipboard } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/modal/ConfirmModal";

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
      return Toast({ message: "링크 복사에 실패했어요.", type: "error" });
    }

    if (shareResult.result === "copied-by-app") {
      Toast({
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
            closeButtonClassName="top-5 right-5"
            contentClassName="max-w-[340px] rounded-[32px]"
            titleClassName="text-[18px] font-extrabold text-slate-800 mb-3 px-1 border-b border-slate-200 pb-4"
          >
            <div className="custom-scrollbar flex max-h-[380px] flex-col gap-1.5 overflow-y-auto pr-1 pb-2">
              {participants.map((participant) => (
                <div
                  key={participant.user.id}
                  className="group flex items-center justify-between rounded-[20px] p-2.5 transition-all duration-200 hover:bg-slate-50 hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() =>
                        router.push(`/users/${participant.user.id}`)
                      }
                      className="group-hover:border-main-purple/20 focus-visible:ring-main-purple relative size-11 shrink-0 overflow-hidden rounded-full border border-slate-100 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(109,40,217,0.15)] focus-visible:ring-2 focus-visible:outline-none"
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

                    <span className="text-[15px] font-bold text-slate-700 transition-colors group-hover:text-slate-900">
                      {participant.user.name || "사용자"}
                    </span>
                  </div>

                  {participant.userId === detail.hostId && (
                    <div className="bg-main-purple/10 border-main-purple/10 flex items-center gap-1 rounded-[12px] border px-2.5 py-1.5 shadow-sm">
                      <span className="text-main-purple mt-0.5 text-[10px] font-black tracking-wider uppercase">
                        Host
                      </span>
                    </div>
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
                  Toast({
                    message: isCopied
                      ? "비밀 코드가 복사되었어요."
                      : "복사에 실패했습니다.",
                    type: isCopied ? "success" : "error",
                  });
                }}
                className="text-main-purple-point rounded-xl bg-purple-100 px-3 py-2 text-xs font-bold transition hover:bg-purple-200"
              >
                복사
              </button>
            </div>
          )}

          <div className="mt-5 flex items-center gap-4 sm:mt-10">
            <Button
              type="button"
              size="responsive-lg"
              disabled={action.disabled || isActionPending || isAuthLoading}
              onClick={() => loginGuardAction(() => void action.handler())}
              className="bg-main-purple hover:bg-main-purple/80 h-16 flex-1 !rounded-[24px] font-bold tracking-[0.1em] text-white shadow-[0_15px_30px_rgba(38,6,86,0.2)] transition-all active:scale-[0.98]"
            >
              <span className="tracking-widest sm:text-sm">
                {isActionPending ? "진행중..." : action.label}
              </span>
            </Button>
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
            initial={{ opacity: 0, x: "-50%", scale: 0.8 }}
            animate={{ opacity: 1, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, x: "-50%", scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-[5%] left-1/2 z-[9999] flex w-[calc(100%-2rem)] max-w-[380px] flex-col items-center rounded-[32px] border-2 border-blue-200 bg-blue-50 px-6 py-7 shadow-xl shadow-blue-900/5"
          >
            <Lottie
              animationData={checkAnim}
              loop={false}
              className="h-24 w-24"
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
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mt-1 flex flex-col items-center text-center"
            >
              <p className="mb-1 text-[15px] font-bold text-slate-500">
                랜덤 출석 포인트를 받았습니다!
              </p>

              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                }}
                className="flex items-baseline justify-center gap-1"
              >
                <span className="bg-gradient-to-br from-blue-500 to-indigo-600 bg-clip-text text-[36px] font-black tracking-tighter text-transparent drop-shadow-sm">
                  +{showReward.point}
                </span>
                <span className="text-[18px] font-extrabold text-indigo-600">
                  P
                </span>
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
        titleClassName="text-lg font-bold"
        closeButtonClassName="top-5 right-5"
        contentClassName="max-w-[400px] rounded-[32px]"
      >
        <div className="flex flex-col gap-6 pt-2 pb-2">
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-[24px] border border-slate-100/50 bg-slate-50/80 px-4 py-5 text-center">
            <LockKeyholeIcon className="mb-3 h-6 w-6 text-slate-500" />
            <p className="text-[15px] font-bold text-slate-700">
              프라이빗 모임에 입장합니다
            </p>
            <p className="text-[13px] font-medium text-slate-500">
              호스트에게 전달받은{" "}
              <span className="text-main-purple font-bold">비밀 코드</span>를
              입력해 주세요.
            </p>
          </div>

          <div className="px-1">
            <Input
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
          </div>

          <Button
            type="button"
            size="responsive-lg"
            disabled={isJoinPending || !secretInput}
            onClick={() => {
              if (!verifySecretCode(secretInput, detail.dateTime)) {
                setSecretError("비밀 코드가 올바르지 않아요.");
                return;
              }
              setIsSecretModalOpen(false);
              handleJoinMeeting();
            }}
            className="bg-main-purple hover:bg-main-purple/90 h-14 w-full !rounded-[20px] text-[16px] font-bold text-white shadow-[0_8px_20px_rgba(109,40,217,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(109,40,217,0.2)] active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
          >
            참여하기
          </Button>
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
