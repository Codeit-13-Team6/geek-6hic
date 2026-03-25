"use client";

import { MeetingBasicInfoSection } from "@/app/meetings/modal/MeetingBasicInfoSection";
import { MeetingBasicInfoStepProps } from "@/app/meetings/modal/modal";

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
      <MeetingBasicInfoSection
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
