"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import crownLgIcon from "@/assets/icon/crown/crown-lg.svg";
import heartsFalse from "@/assets/icon/hearts/hearts-false.svg";
import heartsTrue from "@/assets/icon/hearts/hearts-true.svg";
import meatballsLgIcon from "@/assets/icon/meatballs/meatballs-lg.svg";
import profileFemaleSm from "@/assets/img/profile/female1-sm.jpg";
import { EditMeetingModal } from "@/app/meetings/[meetingId]/components/EditMeetingModal";
import {
  MeetingDetailData,
  MeetingParticipantUser,
} from "@/app/meetings/[meetingId]/types";
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

//임시로 나중에 !value?.includes("example.com") ~ 제거
const hasUsableProfileImage = (
  value: string | null | undefined,
): value is string =>
  Boolean(value) &&
  !value?.includes("example.com") &&
  !value?.startsWith("blob:");

interface MeetingHeaderSectionProps {
  data: MeetingDetailData;
  participantAvatars: MeetingParticipantUser[];
  isFavoritePending: boolean;
  isJoinPending: boolean;
  isAuthLoading: boolean;
  actionLabel: string;
  isActionDisabled: boolean;
  shouldShowHostMenu: boolean;
  shouldShowClosedGuide: boolean;
  onJoin: () => Promise<void> | void;
  onCancelJoin: () => Promise<void> | void;
  onAttend: () => Promise<void> | void;
  onShare: () => Promise<void> | void;
  onEdit: (nextValues: Partial<MeetingDetailData>) => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

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
    if (isAuthLoading) {
      return;
    }

    if (!data.isLoggedIn) {
      setIsLoginConfirmOpen(true);
      return;
    }

    if (isJoinPending || isActionDisabled) {
      return;
    }

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
    if (isAuthLoading) {
      return;
    }

    if (!data.isLoggedIn) {
      setIsLoginConfirmOpen(true);
      return;
    }

    if (isFavoritePending) {
      return;
    }

    onToggleFavorite();
  };

  const renderParticipantAvatar = (
    participant: MeetingParticipantUser,
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
        className="size-7 rounded-full border-2 border-white object-cover xl:size-9"
      />
    );
  };

  return (
    <>
      <section className="grid gap-3 md:grid-cols-[333px_343px] md:gap-5 xl:grid-cols-[630px_630px] xl:gap-5">
        <div className="overflow-hidden rounded-[12px] bg-gray-100 md:h-[332px] md:w-[333px] md:rounded-[20px] xl:h-[443px] xl:w-[630px] xl:rounded-[32px]">
          {data.image ? (
            <Image
              src={data.image}
              alt={data.name}
              width={760}
              height={520}
              className="h-[241px] w-full object-cover md:h-full"
            />
          ) : (
            <div className="h-[241px] w-full bg-gray-100 md:h-full" />
          )}
        </div>

        <div className="space-y-3 md:space-y-5">
          <div className="rounded-[20px] border border-gray-100 bg-white px-6 pt-5 pb-6 shadow-sm md:h-[200px] md:w-[343px] md:px-6 md:pt-5 md:pb-6 xl:h-[282px] xl:w-[630px] xl:rounded-[28px] xl:px-10 xl:pt-[34px] xl:pb-8">
            <div className="flex items-start justify-between gap-2 md:gap-3 xl:gap-4">
              <div className="min-w-0 space-y-3 md:space-y-3 xl:space-y-4">
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <TagCommon variant="blue">모임 일정</TagCommon>
                  <TagCommon variant="white">
                    {formatMonthDay(data.dateTime)}
                  </TagCommon>
                  <TagCommon variant="white">
                    {formatHourMinute(data.dateTime)}
                  </TagCommon>
                </div>

                <div className="flex items-center gap-2">
                  <h1 className="text-[16px] leading-[24px] font-semibold text-gray-900 xl:text-[34px] xl:leading-[42px]">
                    {data.name}
                  </h1>
                  {data.isHost ? (
                    <Image src={crownLgIcon} alt="" width={24} height={24} />
                  ) : null}
                </div>
              </div>

              {shouldShowHostMenu ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button
                        type="button"
                        className="rounded-full border border-transparent p-1 transition hover:bg-gray-50"
                      >
                        <Image
                          src={meatballsLgIcon}
                          alt="모임 메뉴 열기"
                          width={32}
                          height={32}
                        />
                      </button>
                    }
                  />

                  <DropdownMenuContent align="end" size="md">
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                      수정하기
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      삭제하기
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>

            <div className="mt-5 flex gap-2 md:mt-5 md:gap-2 xl:mt-8 xl:gap-3">
              <BtnCommon
                type="button"
                variant="teritary"
                size="icon-md"
                disabled={isFavoritePending}
                onClick={handleFavoriteClick}
                className="size-11 shrink-0 rounded-full xl:size-16"
              >
                <Image
                  src={data.isFavorited ? heartsTrue : heartsFalse}
                  alt="즐겨찾기"
                  width={24}
                  height={24}
                />
              </BtnCommon>

              <BtnCommon
                type="button"
                size="md"
                disabled={isActionDisabled || isJoinPending || isAuthLoading}
                onClick={handleActionClick}
                className="h-11 w-auto min-w-0 flex-1 rounded-[14px] text-[14px] xl:h-16 xl:rounded-[18px]"
              >
                {isJoinPending ? "처리 중..." : actionLabel}
              </BtnCommon>
            </div>

            {shouldShowClosedGuide ? (
              <p className="mt-3 text-[12px] text-gray-500 xl:text-sm">
                모집이 마감되어 더 이상 참여할 수 없습니다.
              </p>
            ) : null}
          </div>

          <div className="rounded-[20px] border border-[#c7f5e8] bg-[#e6fbf5] px-6 pt-5 pb-[22px] md:h-[113px] md:w-[343px] md:px-6 md:pt-5 md:pb-[22px] xl:h-[141px] xl:w-[630px] xl:rounded-[28px] xl:px-10 xl:pt-7 xl:pb-[34px]">
            <div className="mb-3 flex items-center gap-2 md:mb-3 md:gap-2 xl:mb-4 xl:gap-3">
              <p className="text-main-green-700 text-[16px] font-semibold xl:text-[28px]">
                {data.participantCount}명 참여
              </p>
              <div className="flex -space-x-2">
                {visibleParticipants.map(renderParticipantAvatar)}
                {hiddenParticipantCount > 0 ? (
                  <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-white text-[10px] font-semibold text-gray-600 xl:size-9 xl:text-sm">
                    +{hiddenParticipantCount}
                  </span>
                ) : null}
              </div>
            </div>

            <Progress value={progressValue} className="gap-2">
              <ProgressLabel className="sr-only">참여 진행률</ProgressLabel>
              <ProgressValue className="sr-only">
                {(formattedValue) =>
                  formattedValue ?? `${data.participantCount}/${data.capacity}`
                }
              </ProgressValue>
            </Progress>
            <div className="mt-2 flex justify-end text-[12px] text-gray-500 xl:text-sm">
              최대 {data.capacity}명
            </div>
          </div>
        </div>
      </section>

      <EditMeetingModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        data={data}
        onSubmit={onEdit}
      />

      <ModalBase
        disablePointerDismissal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        contentClassName="w-[343px] max-w-[calc(100vw-24px)] rounded-[24px] border-none px-6 py-6 shadow-2xl md:w-[560px] md:rounded-[40px] md:px-10 md:pt-12 md:pb-10"
        title=""
      >
        <div className="pt-2 text-center md:pt-4">
          <p className="text-[20px] font-semibold text-gray-900 md:text-[24px]">
            모임을 정말 삭제하시겠어요?
          </p>
          <p className="mt-3 text-[14px] text-gray-500 md:text-[16px]">
            삭제 후에는 되돌릴 수 없습니다.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5 md:mt-10 md:gap-3">
          <BtnCommon
            type="button"
            variant="teritary"
            size="md"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            취소
          </BtnCommon>
          <BtnCommon
            type="button"
            size="md"
            onClick={() => {
              onDelete();
              setIsDeleteModalOpen(false);
            }}
          >
            확인
          </BtnCommon>
        </div>
      </ModalBase>

      <ModalBase
        disablePointerDismissal
        isOpen={isLoginConfirmOpen}
        onOpenChange={setIsLoginConfirmOpen}
        contentClassName="w-[343px] max-w-[calc(100vw-24px)] rounded-[24px] border-none px-6 py-6 shadow-2xl md:w-[560px] md:rounded-[40px] md:px-10 md:pt-12 md:pb-10"
        title=""
      >
        <div className="pt-2 text-center md:pt-4">
          <p className="text-[20px] font-semibold text-gray-900 md:text-[24px]">
            로그인이 필요한 서비스입니다.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5 md:mt-10 md:gap-3">
          <BtnCommon
            type="button"
            variant="teritary"
            size="md"
            onClick={() => setIsLoginConfirmOpen(false)}
          >
            취소
          </BtnCommon>
          <BtnCommon
            type="button"
            size="md"
            onClick={() => {
              setIsLoginConfirmOpen(false);
              router.push("/login");
            }}
          >
            로그인
          </BtnCommon>
        </div>
      </ModalBase>
    </>
  );
}
