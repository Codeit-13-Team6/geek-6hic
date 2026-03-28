"use client";

import { ImageUploadInput } from "@/components/ui/ImageUploadInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcnOrigin/select";
import { InputCommon } from "@/components/ui/InputCommon";
import { TextareaCommon } from "@/components/ui/TextareaCommon";

import type { StaticImageData } from "next/image";
import teamBulb from "@/assets/img/bulb/elec-bulb.jpg";
import studyImage from "@/assets/img/category/study.jpg";
import towerWork from "@/assets/img/category/business.jpg";
import JobIShoes from "@/assets/img/category/fitness-health.jpg";
import etcImage from "@/assets/img/category/etc.jpg";
import { MeetingBasicInfoSectionProps } from "@/types/meeting/meeting-form.props";

export interface MeetingTypeOption {
  value: string;
  label: string;
}

export interface MeetingCategoryItem {
  value: string;
  label: string;
  imageSrc: StaticImageData;
  className?: string;
}

export const MEETING_CATEGORY_LIST: MeetingCategoryItem[] = [
  {
    value: "친목/여가",
    label: "친목/여가",
    imageSrc: teamBulb,
  },
  {
    value: "스터디",
    label: "스터디",
    imageSrc: studyImage,
  },
  {
    value: "워케이션",
    label: "워케이션",
    imageSrc: towerWork,
  },
  {
    value: "취미/운동",
    label: "취미/운동",
    imageSrc: JobIShoes,
  },
  {
    value: "기타",
    label: "기타",
    imageSrc: etcImage,
    className: "col-span-2",
  },
];

export const DEFAULT_MEETING_TYPE_OPTIONS: MeetingTypeOption[] =
  MEETING_CATEGORY_LIST.map(({ value, label }) => ({
    value,
    label,
  }));

export function MeetingBasicInfoSection({
  values,
  errors,
  isImageUploading,
  onChange,
  onChangeImage,
  onRemoveImage,
  showCategoryField = false,
  showImageMeta = true,
}: MeetingBasicInfoSectionProps) {
  const meetingTypeOptions = (() => {
    if (!values.category) {
      return DEFAULT_MEETING_TYPE_OPTIONS;
    }

    const hasCurrentType = DEFAULT_MEETING_TYPE_OPTIONS.some(
      (option) => option.value === values.category,
    );

    if (hasCurrentType) {
      return DEFAULT_MEETING_TYPE_OPTIONS;
    }

    return [
      {
        value: values.category,
        label: values.category || "현재 모임 종류",
      },
      ...DEFAULT_MEETING_TYPE_OPTIONS,
    ];
  })();

  return (
    <div className="space-y-5">
      {showCategoryField ? (
        <div className="flex flex-col gap-[6px]">
          <label className="text-[14px] font-medium text-gray-800">
            모임 종류
          </label>
          <Select
            value={values.category}
            onValueChange={(value) => {
              if (!value) {
                return;
              }

              onChange({ category: value });
            }}
          >
            <SelectTrigger className="!h-[50px] w-full rounded-[8px] border border-gray-300 bg-gray-50 px-4 text-base text-gray-800">
              <SelectValue>
                {meetingTypeOptions.find(
                  (option) => option.value === values.category,
                )?.label ?? "모임 종류를 선택해 주세요"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="w-[--anchor-width]">
              {meetingTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category ? (
            <p className="text-error text-[12px] leading-[16px]">
              {errors.category}
            </p>
          ) : null}
        </div>
      ) : null}

      <InputCommon
        label="모임 이름"
        isRequired
        value={values.name}
        placeholder="모임 이름을 입력해 주세요"
        onChange={(event) => {
          onChange({ name: event.target.value });
        }}
        onClear={() => {
          onChange({ name: "" });
        }}
        isDestructive={Boolean(errors.name)}
        hintText={errors.name}
      />

      <TextareaCommon
        label="모임 설명"
        isRequired
        value={values.description}
        placeholder="모임 설명을 입력해 주세요"
        onChange={(event) => {
          onChange({ description: event.target.value });
        }}
        isDestructive={Boolean(errors.description)}
        hintText={errors.description}
      />

      <InputCommon
        label="모임 링크"
        isRequired
        value={values.link}
        placeholder="모임 링크를 입력해 주세요"
        onChange={(event) => {
          onChange({ link: event.target.value });
        }}
        onClear={() => {
          onChange({ link: "" });
        }}
        isDestructive={Boolean(errors.link)}
        hintText={errors.link}
      />

      <div className="space-y-2">
        <p className="text-[14px] font-medium text-gray-800">
          이미지
          <span className="ml-1 text-green-500">*</span>
        </p>

        <ImageUploadInput
          size="sm"
          imageSrc={values.previewImageUrl}
          onFileSelect={(file) => {
            onChangeImage(file);
          }}
          onRemove={onRemoveImage}
        />

        {showImageMeta ? (
          <p className="text-sm text-gray-500">
            {values.imageFile ? values.imageFile.name : "선택된 파일 없음"}
          </p>
        ) : null}

        {isImageUploading ? (
          <p className="text-sm text-gray-500">이미지 업로드 중..</p>
        ) : null}

        {showImageMeta && values.imageUrl ? (
          <p className="text-sm text-green-600">이미지 업로드 완료</p>
        ) : null}

        {errors.imageUrl ? (
          <p className="text-error text-sm">{errors.imageUrl}</p>
        ) : null}
      </div>
    </div>
  );
}
