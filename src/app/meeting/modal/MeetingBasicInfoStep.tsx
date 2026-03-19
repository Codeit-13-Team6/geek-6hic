"use client";

import { InputCommon } from "@/components/ui/InputCommon"; // 변경 (경로 수정)
import { TextareaCommon } from "@/components/ui/TextareaCommon"; // 변경 (경로 수정)
import { ImageUploadInputCommon } from "@/components/ui/ImageUploadInputCommon"; // 변경 (경로 수정)
import { MeetingBasicInfoStepProps } from "@/app/meeting/modal/modal";

export function MeetingBasicInfoStep({
  values,
  errors,
  isImageUploading,
  onChange,
  onChangeImage,
  onRemoveImage,
}: MeetingBasicInfoStepProps) {
  return (
    <div className="pt-6">
      <div className="space-y-5">
        {/* 모임 이름 */}
        <InputCommon
          label="모임 이름"
          isRequired
          value={values.name}
          placeholder="모임 이름을 입력해주세요"
          onChange={(event) => {
            onChange({ name: event.target.value });
          }}
          onClear={() => {
            onChange({ name: "" });
          }}
          isDestructive={Boolean(errors.name)}
          hintText={errors.name}
        />

        {/* 모임 설명 */}
        <TextareaCommon
          label="모임 설명"
          isRequired
          value={values.description}
          placeholder="모임 설명을 입력해주세요"
          onChange={(event) => {
            onChange({ description: event.target.value });
          }}
          isDestructive={Boolean(errors.description)}
          hintText={errors.description}
        />

        {/* 모임 링크 */}
        <InputCommon
          label="모임 링크"
          isRequired
          value={values.link}
          placeholder="모임 링크를 입력해주세요"
          onChange={(event) => {
            onChange({ link: event.target.value });
          }}
          onClear={() => {
            onChange({ link: "" });
          }}
          isDestructive={Boolean(errors.link)}
          hintText={errors.link}
        />

        {/* 이미지 */}
        <div className="space-y-2">
          <p className="text-[14px] font-medium text-gray-800">
            이미지
            <span className="ml-1 text-green-500">*</span>
          </p>

          <ImageUploadInputCommon
            size="sm"
            imageSrc={values.previewImageUrl}
            onFileSelect={(file) => {
              onChangeImage(file);
            }}
            onRemove={onRemoveImage}
          />

          <p className="text-sm text-gray-500">
            {values.imageFile ? values.imageFile.name : "선택된 파일 없음"}
          </p>

          {isImageUploading ? (
            <p className="text-sm text-gray-500">이미지 업로드 중...</p>
          ) : null}

          {values.imageUrl ? (
            <p className="text-sm text-green-600">이미지 업로드 완료</p>
          ) : null}

          {errors.imageUrl ? (
            <p className="text-error text-sm">{errors.imageUrl}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
