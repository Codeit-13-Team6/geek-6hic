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
import { BtnCommon } from "@/components/ui/BtnCommon";
import ModalBase from "@/components/ui/ModalBase";
import { ToastCommon } from "@/components/ui/ToastCommon";

type EditMeetingTab = "basic" | "schedule";

interface EditMeetingModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  data: MeetingDetailData;
  onSubmit: (nextValues: Partial<MeetingDetailData>) => Promise<void> | void;
}

const getIsoDateTime = (date: string, time: string) =>
  new Date(`${date}T${time}`).toISOString();

const formatLocalDate = (value: string) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatLocalTime = (value: string) => {
  const date = new Date(value);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const toFormValues = (data: MeetingDetailData): MeetingFormValues => ({
  category: data.type,
  name: data.name,
  description: data.description,
  link: data.link,
  imageFile: null,
  previewImageUrl: data.image ?? "",
  imageUrl: data.image ?? "",
  startDate: formatLocalDate(data.dateTime),
  startTime: formatLocalTime(data.dateTime),
  endDate: formatLocalDate(data.registrationEnd),
  endTime: formatLocalTime(data.registrationEnd),
  capacity: String(data.capacity),
});

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewImageUrlRef = useRef("");
  const previousIsOpenRef = useRef(false);

  const resetEditMeetingForm = (nextData: MeetingDetailData) => {
    const nextValues = toFormValues(nextData);

    previewImageUrlRef.current = nextValues.previewImageUrl;
    setActiveTab("basic");
    setFormValues(nextValues);
    setErrors(createEmptyErrors());
    setIsImageUploading(false);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!previousIsOpenRef.current && isOpen) {
      queueMicrotask(() => {
        resetEditMeetingForm(data);
      });
    }

    previousIsOpenRef.current = isOpen;
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

  const handleSubmit = async () => {
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

    setIsSubmitting(true);

    try {
      await onSubmit({
        type: formValues.category,
        name: formValues.name,
        description: formValues.description,
        link: formValues.link,
        image: formValues.imageUrl || formValues.previewImageUrl || null,
        dateTime: getIsoDateTime(formValues.startDate, formValues.startTime),
        registrationEnd: getIsoDateTime(formValues.endDate, formValues.endTime),
        capacity: Number(formValues.capacity),
      });

      handleClose();
    } catch {
      // updateMeetingMutation toast handles the error
    } finally {
      setIsSubmitting(false);
    }
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
              disabled={isSubmitting}
              onClick={requestClose}
            >
              취소
            </BtnCommon>
            <BtnCommon
              type="button"
              size="md"
              className="flex-1"
              disabled={isImageUploading || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "처리 중..." : "수정하기"}
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
