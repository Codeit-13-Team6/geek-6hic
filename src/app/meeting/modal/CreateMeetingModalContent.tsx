"use client";

import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/shadcnOrigin/dialog";
import { MeetingCategoryStep } from "./MeetingCategoryStep";
import { Button } from "@/components/shadcnOrigin/button";
import { MeetingBasicInfoStep } from "./MeetingBasicInfoStep";
import { MeetingScheduleStep } from "./MeetingScheduleStep";

import { toastCommon } from "@/lib/toastCommon";
import {
  CreateMeetingFormValues,
  CreateMeetingModalContentProps,
} from "./modal";
import { uploadMeetingImage } from "./services/uploadMeetingImage";
import axiosInstance from "@/lib/axios";

const INITIAL_FORM_VALUES: CreateMeetingFormValues = {
  category: "",
  name: "",
  description: "",
  link: "",
  imageFile: null,
  imageUrl: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  capacity: "",
};

const TOTAL_STEPS = 3;

export function CreateMeetingModalContent({
  onClose,
}: CreateMeetingModalContentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formValues, setFormValues] =
    useState<CreateMeetingFormValues>(INITIAL_FORM_VALUES);

  const [isImageUploading, setIsImageUploading] = useState(false);

  const handleChangeBasicInfo = async (nextValues: {
    name?: string;
    description?: string;
    link?: string;
    imageFile?: File | null;
  }) => {
    if (nextValues.imageFile !== undefined) {
      const nextFile = nextValues.imageFile;

      setFormValues((prev) => ({
        ...prev,
        imageFile: nextFile,
      }));

      if (!nextFile) {
        setFormValues((prev) => ({
          ...prev,
          imageUrl: "",
        }));
        return;
      }

      try {
        setIsImageUploading(true);

        const nextImageUrl = await uploadMeetingImage(nextFile);

        setFormValues((prev) => ({
          ...prev,
          imageFile: nextFile,
          imageUrl: nextImageUrl,
        }));
      } catch (error) {
        setFormValues((prev) => ({
          ...prev,
          imageFile: null,
          imageUrl: "",
        }));
      } finally {
        setIsImageUploading(false);
      }

      return;
    }

    setFormValues((prev) => ({
      ...prev,
      ...nextValues,
    }));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
  };

  const getCreateMeetingPayload = () => {
    return {
      name: formValues.name,
      type: formValues.category,
      region: "온라인",
      address: formValues.link,
      latitude: 0,
      longitude: 0,
      dateTime: `${formValues.startDate}T${formValues.startTime}:00.000Z`,
      registrationEnd: `${formValues.endDate}T${formValues.endTime}:00.000Z`,
      capacity: Number(formValues.capacity),
      image: formValues.imageUrl,
      description: formValues.description,
    };
  };

  const handleSubmitMeeting = async () => {
    try {
      const payload = getCreateMeetingPayload();
      const { data } = await axiosInstance.post("/meetings", payload);

      toastCommon({ message: `${data.name} 모임 생성완료` });
      onClose();
    } catch (error) {
      console.error("meeting create error", error);
    }
  };

  const getIsCurrentStepValid = () => {
    if (currentStep === 1) {
      return Boolean(formValues.category);
    }

    if (currentStep === 2) {
      return (
        Boolean(formValues.name.trim()) &&
        Boolean(formValues.description.trim()) &&
        Boolean(formValues.link.trim()) &&
        Boolean(formValues.imageUrl.trim())
      );
    }

    return (
      Boolean(formValues.startDate) &&
      Boolean(formValues.startTime) &&
      Boolean(formValues.endDate) &&
      Boolean(formValues.endTime) &&
      Boolean(formValues.capacity.trim())
    );
  };

  const isNextDisabled = !getIsCurrentStepValid();

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          모임 만들기 {currentStep}/{TOTAL_STEPS}
        </DialogTitle>
      </DialogHeader>

      {currentStep === 1 ? (
        <MeetingCategoryStep
          value={formValues.category}
          onChange={(value) => {
            setFormValues((prev) => ({
              ...prev,
              category: value,
            }));
          }}
        />
      ) : null}

      {currentStep === 2 ? (
        <MeetingBasicInfoStep
          values={{
            name: formValues.name,
            description: formValues.description,
            link: formValues.link,
            imageFile: formValues.imageFile,
            imageUrl: formValues.imageUrl,
          }}
          isImageUploading={isImageUploading}
          onChange={handleChangeBasicInfo}
        />
      ) : null}

      {currentStep === 3 ? (
        <MeetingScheduleStep
          values={{
            startDate: formValues.startDate,
            startTime: formValues.startTime,
            endDate: formValues.endDate,
            endTime: formValues.endTime,
            capacity: formValues.capacity,
          }}
          onChange={(nextValues) => {
            setFormValues((prev) => ({
              ...prev,
              ...nextValues,
            }));
          }}
        />
      ) : null}

      <div className="mt-8 flex gap-3">
        {currentStep === 1 ? (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            취소
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handlePrevStep}
          >
            이전
          </Button>
        )}

        {currentStep < TOTAL_STEPS ? (
          <Button
            type="button"
            className="flex-1"
            onClick={handleNextStep}
            disabled={isNextDisabled}
          >
            다음
          </Button>
        ) : (
          <Button
            type="button"
            className="flex-1"
            onClick={handleSubmitMeeting}
            disabled={isNextDisabled}
          >
            모임 만들기
          </Button>
        )}
      </div>
    </>
  );
}
