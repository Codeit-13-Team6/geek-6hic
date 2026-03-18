"use client";
import Image from "next/image";
import insertImageIcon from "@/assets/icon/textEditor/insert-image-default.svg";
import { MeetingBasicInfoStepProps } from "./modal";

export function MeetingBasicInfoStep({
  values,
  isImageUploading,
  onChange,
}: MeetingBasicInfoStepProps) {
  return (
    <div className="pt-6">
      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="meeting-name" className="text-sm font-medium">
            모임 이름
          </label>

          <input
            id="meeting-name"
            className="h-10 w-full rounded-lg border px-3"
            value={values.name}
            onChange={(event) => {
              onChange({ name: event.target.value });
            }}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="meeting-description" className="text-sm font-medium">
            모임 설명
          </label>

          <textarea
            id="meeting-description"
            className="min-h-[100px] w-full rounded-lg border px-3 py-2"
            value={values.description}
            onChange={(event) => {
              onChange({ description: event.target.value });
            }}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="meeting-link" className="text-sm font-medium">
            모임 링크
          </label>

          <input
            id="meeting-link"
            className="h-10 w-full rounded-lg border px-3"
            value={values.link}
            onChange={(event) => {
              onChange({ link: event.target.value });
            }}
          />
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium">이미지</span>

          <label
            htmlFor="meeting-image"
            className="flex h-[120px] w-[120px] cursor-pointer items-center justify-center rounded-lg border border-dashed"
          >
            <Image
              src={insertImageIcon}
              alt="이미지 추가"
              width={80}
              height={80}
            />
          </label>

          <input
            id="meeting-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const nextFile = event.target.files?.[0] ?? null;
              onChange({ imageFile: nextFile });
            }}
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
        </div>
      </div>
    </div>
  );
}
