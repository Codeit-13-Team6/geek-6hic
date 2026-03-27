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
        className="size-7 rounded-full border-2 border-white object-cover lg:size-9"
      />
    );
  };

  return (
    <>
      <section className="grid grid-cols-1 gap-3 sm:gap-5 lg:grid-cols-2 lg:gap-5">
        <div className="overflow-hidden rounded-[12px] bg-gray-100 sm:rounded-[20px] lg:rounded-[32px]">
          {data.image ? (
            <Image
              src={data.image}
              alt={data.name}
              width={760}
              height={520}
              className="aspect-[4/3] w-full object-cover lg:aspect-[630/443]"
            />
          ) : (
            <div className="aspect-[4/3] w-full bg-gray-100 lg:aspect-[630/443]" />
          )}
        </div>

        <div className="space-y-3 sm:space-y-5">
          <div className="rounded-[20px] border border-gray-100 bg-white px-6 pt-5 pb-6 shadow-sm sm:min-h-[200px] lg:min-h-[282px] lg:rounded-[28px] lg:px-10 lg:pt-[34px] lg:pb-8">
            <div className="flex items-start justify-between gap-2 sm:gap-3 lg:gap-4">
              <div className="min-w-0 space-y-3 sm:space-y-3 lg:space-y-4">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <TagCommon variant="blue">모임 일정</TagCommon>
                  <TagCommon variant="white">
                    {formatMonthDay(data.dateTime)}
                  </TagCommon>
                  <TagCommon variant="white">
                    {formatHourMinute(data.dateTime)}
                  </TagCommon>
                </div>

                <div className="flex items-center gap-2">
                  <h1 className="min-w-0 text-[16px] leading-[24px] font-semibold break-words text-gray-900 lg:text-[34px] lg:leading-[42px]">
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

            <div className="mt-5 flex gap-2 sm:mt-5 sm:gap-2 lg:mt-8 lg:gap-3">
              <BtnCommon
                type="button"
                variant="teritary"
                size="icon-md"
                disabled={isFavoritePending}
                onClick={handleFavoriteClick}
                className="size-11 shrink-0 rounded-full lg:size-16"
              >
                <Image
                  src={data.isFavorited ? heartsTrue : heartsFalse}
                  alt="좋아요"
                  width={24}
                  height={24}
                />
              </BtnCommon>

              <BtnCommon
                type="button"
                size="md"
                disabled={isActionDisabled || isJoinPending || isAuthLoading}
                onClick={handleActionClick}
                className="h-11 w-auto min-w-0 flex-1 rounded-[14px] text-[14px] lg:h-16 lg:rounded-[18px]"
              >
                {isJoinPending ? "처리 중.." : actionLabel}
              </BtnCommon>
            </div>

            {shouldShowClosedGuide ? (
              <p className="mt-3 text-[12px] text-gray-500 lg:text-sm">
                모집이 마감되어 더 이상 참여할 수 없습니다.
              </p>
            ) : null}
          </div>

          <div className="rounded-[20px] border border-[#c7f5e8] bg-[#e6fbf5] px-6 pt-5 pb-[22px] sm:min-h-[113px] lg:min-h-[141px] lg:rounded-[28px] lg:px-10 lg:pt-7 lg:pb-[34px]">
            <div className="mb-3 flex items-center gap-2 sm:mb-3 sm:gap-2 lg:mb-4 lg:gap-3">
              <p className="text-main-green-700 text-[16px] font-semibold lg:text-[28px]">
                {data.participantCount}명 참여
              </p>
              <div className="flex -space-x-2">
                {visibleParticipants.map(renderParticipantAvatar)}
                {hiddenParticipantCount > 0 ? (
                  <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-white text-[10px] font-semibold text-gray-600 lg:size-9 lg:text-sm">
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
            <div className="mt-2 flex justify-end text-[12px] text-gray-500 lg:text-sm">
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
