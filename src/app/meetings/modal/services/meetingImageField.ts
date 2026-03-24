"use client";

import type { Dispatch, SetStateAction } from "react";

import { MeetingFormValues } from "@/app/meetings/modal/modal";
import { uploadMeetingImage } from "@/app/meetings/modal/services/uploadMeetingImage";

interface ChangeMeetingImageParams {
  nextFile: File | null;
  previewImageUrlRef: { current: string };
  setFormValues: Dispatch<SetStateAction<MeetingFormValues>>;
  setIsImageUploading: Dispatch<SetStateAction<boolean>>;
  clearImageError: () => void;
  setImageError: (message: string) => void;
  onUploadError: () => void;
}

interface RemoveMeetingImageParams {
  previewImageUrlRef: { current: string };
  setFormValues: Dispatch<SetStateAction<MeetingFormValues>>;
  setIsImageUploading: Dispatch<SetStateAction<boolean>>;
  clearImageError: () => void;
}

export const revokeMeetingPreviewImageUrl = (previewImageUrl: string) => {
  if (!previewImageUrl || !previewImageUrl.startsWith("blob:")) {
    return;
  }

  URL.revokeObjectURL(previewImageUrl);
};

export const changeMeetingImage = async ({
  nextFile,
  previewImageUrlRef,
  setFormValues,
  setIsImageUploading,
  clearImageError,
  setImageError,
  onUploadError,
}: ChangeMeetingImageParams) => {
  if (!nextFile) {
    return;
  }

  const nextPreviewImageUrl = URL.createObjectURL(nextFile);

  revokeMeetingPreviewImageUrl(previewImageUrlRef.current);
  previewImageUrlRef.current = nextPreviewImageUrl;

  setFormValues((prev) => ({
    ...prev,
    imageFile: nextFile,
    previewImageUrl: nextPreviewImageUrl,
    imageUrl: "",
  }));
  clearImageError();
  setIsImageUploading(true);

  try {
    const nextImageUrl = await uploadMeetingImage(nextFile);

    setFormValues((prev) => ({
      ...prev,
      imageFile: nextFile,
      imageUrl: nextImageUrl,
    }));
    clearImageError();
  } catch {
    setFormValues((prev) => ({
      ...prev,
      imageFile: nextFile,
      imageUrl: "",
    }));
    setImageError("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    onUploadError();
  } finally {
    setIsImageUploading(false);
  }
};

export const removeMeetingImage = ({
  previewImageUrlRef,
  setFormValues,
  setIsImageUploading,
  clearImageError,
}: RemoveMeetingImageParams) => {
  revokeMeetingPreviewImageUrl(previewImageUrlRef.current);
  previewImageUrlRef.current = "";

  setFormValues((prev) => ({
    ...prev,
    imageFile: null,
    previewImageUrl: "",
    imageUrl: "",
  }));
  clearImageError();
  setIsImageUploading(false);
};
