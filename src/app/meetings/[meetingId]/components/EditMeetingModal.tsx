"use client";

import { useEffect, useRef, useState } from "react";

import { MeetingBasicInfoSection } from "@/app/meetings/modal/MeetingBasicInfoSection";
import { MeetingScheduleStep } from "@/app/meetings/modal/MeetingScheduleStep";
import {
  MeetingFormErrors,
  MeetingFormValues,
} from "@/app/meetings/modal/modal";
import {
  hasMeetingValidationError,
  validateMeetingBasicInfoStep,
  validateMeetingCategoryStep,
  validateMeetingScheduleStep,
} from "@/app/meetings/modal/meetingValidation";
import {
  changeMeetingImage,
  removeMeetingImage,
  revokeMeetingPreviewImageUrl,
} from "@/app/meetings/modal/services/meetingImageField";
import { MeetingDetailData } from "@/app/meetings/[meetingId]/types";
import ModalBase from "@/components/ui/ModalBase";
import { BtnCommon } from "@/components/ui/BtnCommon";
import { ToastCommon } from "@/components/ui/ToastCommon";

type EditMeetingTab = "basic" | "schedule";

interface EditMeetingModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  data: MeetingDetailData;
  onSubmit: (nextValues: Partial<MeetingDetailData>) => void;
}

const getIsoDateTime = (date: string, time: string) => {
  return new Date(`${date}T${time}`).toISOString();
};

const toFormValues = (data: MeetingDetailData): MeetingFormValues => {
  return {
    category: data.type,
    name: data.name,
    description: data.description,
    link: data.link,
    imageFile: null,
    previewImageUrl: data.image,
    imageUrl: data.image,
    startDate: data.dateTime.slice(0, 10),
    startTime: data.dateTime.slice(11, 16),
    endDate: data.registrationEnd.slice(0, 10),
    endTime: data.registrationEnd.slice(11, 16),
    capacity: String(data.capacity),
  };
};

const createEmptyErrors = (): MeetingFormErrors => ({
  category: "",
  name: "",
  description: "",
  link: "",
  imageUrl: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  capacity: "",
});

export function EditMeetingModal({
  isOpen,
  onOpenChange,
  data,
  onSubmit,
}: EditMeetingModalProps) {
  const [activeTab, setActiveTab] = useState<EditMeetingTab>("basic");
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
  const [formValues, setFormValues] = useState<MeetingFormValues>(
    toFormValues(data),
  );
  const [errors, setErrors] = useState<MeetingFormErrors>(createEmptyErrors);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const previewImageUrlRef = useRef("");
  // 모달을 다시 열면 최신 상세 데이터를 기준으로 폼과 에러 상태를 모두 되돌린다.

  // 수정 모달은 기존 상세 데이터를 폼 상태로 다시 주입해야 해서
  // 모달이 열릴 때마다 탭, 에러, 이미지 업로드 상태까지 함께 초기화합니다.
  const resetEditMeetingForm = (nextData: MeetingDetailData) => {
    const nextValues = toFormValues(nextData);

    previewImageUrlRef.current = nextValues.previewImageUrl;
    setActiveTab("basic");
    setFormValues(nextValues);
    setErrors(createEmptyErrors());
    setIsImageUploading(false);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    queueMicrotask(() => {
      resetEditMeetingForm(data);
    });
  }, [data, isOpen]);

  useEffect(() => {
    return () => {
      revokeMeetingPreviewImageUrl(previewImageUrlRef.current);
    };
  }, []);

  const handleClose = () => {
    onOpenChange(false);
  };

  const requestClose = () => {
    setIsCloseConfirmOpen(true);
  };

  const handleChangeMeetingImage = async (nextFile: File | null) => {
    await changeMeetingImage({
      nextFile,
      previewImageUrlRef,
      setFormValues,
      setIsImageUploading,
      clearImageError: () => {
        setErrors((prev) => ({
          ...prev,
          imageUrl: "",
        }));
      },
      setImageError: (message) => {
        setErrors((prev) => ({
          ...prev,
          imageUrl: message,
        }));
      },
      onUploadError: () => {
        ToastCommon({ message: "이미지 업로드에 실패했습니다." });
      },
    });
  };

  const handleRemoveMeetingImage = () => {
    removeMeetingImage({
      previewImageUrlRef,
      setFormValues,
      setIsImageUploading,
      clearImageError: () => {
        setErrors((prev) => ({
          ...prev,
          imageUrl: "",
        }));
      },
    });
  };

  // 기본 정보 탭은 category + basic info를 함께 보여주기 때문에
  // 값 갱신과 관련 에러 해제를 한 번에 처리합니다.
  // 기본 탭은 카테고리와 상세 정보를 함께 다뤄 관련 에러도 같이 초기화한다.
  const handleChangeBasicTab = (nextValues: {
    category?: string;
    name?: string;
    description?: string;
    link?: string;
    imageFile?: File | null;
    previewImageUrl?: string;
    imageUrl?: string;
  }) => {
    setFormValues((prev) => ({
      ...prev,
      ...nextValues,
    }));
    setErrors((prev) => ({
      ...prev,
      category: nextValues.category ? "" : prev.category,
      name: typeof nextValues.name === "string" ? "" : prev.name,
      description:
        typeof nextValues.description === "string" ? "" : prev.description,
      link: typeof nextValues.link === "string" ? "" : prev.link,
    }));
  };

  // 일정 탭도 같은 방식으로 값 변경과 해당 필드 에러 초기화를 같이 처리합니다.
  // 일정 탭도 동일한 방식으로 값 변경과 에러 해제를 묶어서 처리한다.
  const handleChangeScheduleTab = (nextValues: {
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    capacity?: string;
  }) => {
    setFormValues((prev) => ({
      ...prev,
      ...nextValues,
    }));
    setErrors((prev) => ({
      ...prev,
      startDate: nextValues.startDate ? "" : prev.startDate,
      startTime: nextValues.startTime ? "" : prev.startTime,
      endDate: nextValues.endDate ? "" : prev.endDate,
      endTime: nextValues.endTime ? "" : prev.endTime,
      capacity: typeof nextValues.capacity === "string" ? "" : prev.capacity,
    }));
  };

  // 탭이 나뉘어 있어도 제출 시점에는 전체 폼을 검증하고,
  // 에러가 있는 탭으로 다시 보내 바로 수정할 수 있게 한다.
  const handleSubmit = () => {
    // 수정 모달은 탭 구조라서 전체 검증 후,
    // 에러가 있는 탭으로 다시 이동시켜 사용자가 바로 수정할 수 있게 합니다.
    const nextCategoryErrors = validateMeetingCategoryStep(formValues);
    const nextBasicErrors = validateMeetingBasicInfoStep(formValues);
    const nextScheduleErrors = validateMeetingScheduleStep(formValues);
    const nextErrors: MeetingFormErrors = {
      ...createEmptyErrors(),
      ...nextCategoryErrors,
      ...nextBasicErrors,
      ...nextScheduleErrors,
    };

    setErrors(nextErrors);

    if (
      hasMeetingValidationError(nextCategoryErrors) ||
      hasMeetingValidationError(nextBasicErrors)
    ) {
      setActiveTab("basic");
      return;
    }

    if (hasMeetingValidationError(nextScheduleErrors)) {
      setActiveTab("schedule");
      return;
    }

    onSubmit({
      type: formValues.category,
      name: formValues.name,
      description: formValues.description,
      link: formValues.link,
      image: formValues.imageUrl || formValues.previewImageUrl,
      dateTime: getIsoDateTime(formValues.startDate, formValues.startTime),
      registrationEnd: getIsoDateTime(formValues.endDate, formValues.endTime),
      capacity: Number(formValues.capacity),
    });

    ToastCommon({ message: "모임 수정이 반영되었습니다." });
    handleClose();
  };

  return (
    <>
      <ModalBase
        disablePointerDismissal
        isOpen={isOpen}
        onOpenChange={(nextIsOpen) => {
          if (!nextIsOpen) {
            requestClose();
            return;
          }

          onOpenChange(nextIsOpen);
        }}
        contentClassName="w-[544px] max-w-[calc(100vw-24px)] rounded-[40px] border-none px-10 py-10 shadow-2xl"
        title="모임 수정하기"
        titleClassName="text-[24px] font-semibold text-gray-900"
      >
        <div className="mt-6">
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`flex-1 border-b-2 px-2 py-4 text-[22px] font-semibold transition ${
                activeTab === "basic"
                  ? "border-main-green-500 text-main-green-500"
                  : "border-transparent text-gray-400"
              }`}
            >
              기본 정보
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              className={`flex-1 border-b-2 px-2 py-4 text-[22px] font-semibold transition ${
                activeTab === "schedule"
                  ? "border-main-green-500 text-main-green-500"
                  : "border-transparent text-gray-400"
              }`}
            >
              일정 및 인원
            </button>
          </div>

          {activeTab === "basic" ? (
            <div className="space-y-5 pt-8">
              <MeetingBasicInfoSection
                values={{
                  category: formValues.category,
                  name: formValues.name,
                  description: formValues.description,
                  link: formValues.link,
                  imageFile: formValues.imageFile,
                  previewImageUrl: formValues.previewImageUrl,
                  imageUrl: formValues.imageUrl,
                }}
                errors={{
                  category: errors.category,
                  name: errors.name,
                  description: errors.description,
                  link: errors.link,
                  imageUrl: errors.imageUrl,
                }}
                isImageUploading={isImageUploading}
                onChange={handleChangeBasicTab}
                onChangeImage={handleChangeMeetingImage}
                onRemoveImage={handleRemoveMeetingImage}
                showCategoryField
                showImageMeta={false}
              />
            </div>
          ) : null}

          {activeTab === "schedule" ? (
            <div className="pt-8">
              <MeetingScheduleStep
                values={{
                  startDate: formValues.startDate,
                  startTime: formValues.startTime,
                  endDate: formValues.endDate,
                  endTime: formValues.endTime,
                  capacity: formValues.capacity,
                }}
                errors={{
                  startDate: errors.startDate,
                  startTime: errors.startTime,
                  endDate: errors.endDate,
                  endTime: errors.endTime,
                  capacity: errors.capacity,
                }}
                onChange={handleChangeScheduleTab}
              />
            </div>
          ) : null}

          <div className="mt-8 flex gap-3">
            <BtnCommon
              type="button"
              variant="outline"
              size="md"
              className="flex-1"
              onClick={requestClose}
            >
              취소
            </BtnCommon>
            <BtnCommon
              type="button"
              size="md"
              className="flex-1"
              onClick={handleSubmit}
            >
              수정하기
            </BtnCommon>
          </div>
        </div>
      </ModalBase>
      <ModalBase
        disablePointerDismissal
        isOpen={isCloseConfirmOpen}
        onOpenChange={setIsCloseConfirmOpen}
        contentClassName="w-[400px] max-w-[calc(100vw-24px)] rounded-[32px] border-none px-8 py-8 shadow-2xl"
        title=""
      >
        <div className="pt-4 text-center">
          <p className="text-[24px] font-semibold text-gray-900">
            취소하시겠습니까?
          </p>
          <p className="mt-3 text-[16px] text-gray-500">
            저장하지 않은 내용은 사라집니다.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3">
          <BtnCommon
            type="button"
            variant="teritary"
            size="md"
            onClick={() => setIsCloseConfirmOpen(false)}
          >
            계속 작성하기
          </BtnCommon>
          <BtnCommon
            type="button"
            size="md"
            onClick={() => {
              setIsCloseConfirmOpen(false);
              handleClose();
            }}
          >
            나가기
          </BtnCommon>
        </div>
      </ModalBase>
    </>
  );
}
