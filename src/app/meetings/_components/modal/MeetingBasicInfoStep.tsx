"use client";

import { MeetingBasicInfoSection } from "@/app/meetings/_components/modal/MeetingBasicInfoSection";
import { MeetingBasicInfoStepProps } from "@/types";

export function MeetingBasicInfoStep({
  meetingTypeOptions,
  values,
  errors,
  isImageUploading,
  onChange,
  onChangeImage,
  onRemoveImage,
}: MeetingBasicInfoStepProps) {
  return (
    <div className="pt-6">
      <MeetingBasicInfoSection
        meetingTypeOptions={meetingTypeOptions}
        values={values}
        errors={errors}
        isImageUploading={isImageUploading}
        onChange={onChange}
        onChangeImage={onChangeImage}
        onRemoveImage={onRemoveImage}
        showImageMeta
      />
    </div>
  );
}
