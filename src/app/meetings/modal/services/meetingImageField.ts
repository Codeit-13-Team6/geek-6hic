"use client";

import type { Dispatch, SetStateAction } from "react";

import { MeetingFormValues } from "@/app/meetings/modal/model/meeting-form.types";
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

// 미리보기로 만든 blob URL만 직접 해제한다.
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

  // 업로드가 끝나기 전까지는 로컬 미리보기 이미지를 먼저 보여 준다.
  const nextPreviewImageUrl = URL.createObjectURL(nextFile);

  revokeMeetingPreviewImageUrl(previewImageUrlRef.current);
  previewImageUrlRef.current = nextPreviewImageUrl;

  setFormValues((prev) => ({
    ...prev,
    imageFile: nextFile,
    previewImageUrl: nextPreviewImageUrl,
    imageUrl: null,
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
      imageUrl: null,
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
  // 이미지 제거 시 업로드 상태와 폼 값도 함께 초기화한다.
  revokeMeetingPreviewImageUrl(previewImageUrlRef.current);
  previewImageUrlRef.current = "";

  setFormValues((prev) => ({
    ...prev,
    imageFile: null,
    previewImageUrl: "",
    imageUrl: null,
  }));
  clearImageError();
  setIsImageUploading(false);
};
