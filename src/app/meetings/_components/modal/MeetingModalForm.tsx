"use client";

import { ImageUploadInput } from "@/components/ui/ImageUploadInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { MeetingModalFormProps } from "@/types";
import { useMeetingTypes } from "@/app/meetings/_hooks/useMeetingTypes";

export function MeetingModalForm({
  values,
  errors,
  isImageUploading,
  onChange,
  onChangeImage,
  onRemoveImage,
  showCategoryField = false,
}: MeetingModalFormProps) {
  const { meetingTypes } = useMeetingTypes();

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
                {meetingTypes.find((option) => option.name === values.category)
                  ?.name ?? "모임 종류를 선택해 주세요"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              side="bottom"
              sideOffset={8}
              align="start"
              alignItemWithTrigger={false}
              className="bg-gray-50 ring-gray-300"
            >
              {meetingTypes.map((option) => (
                <SelectItem key={option.id} value={option.name}>
                  {option.name}
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

      <Input
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

      <Textarea
        label="모임 설명"
        isRequired
        value={values.description}
        placeholder="모임 설명을 입력해 주세요"
        onChange={(event) => {
          onChange({ description: event.target.value });
        }}
        isDestructive={Boolean(errors.description)}
        hintText={errors.description}
        maxLength={999}
      />

      <Input
        label="모임 링크"
        isRequired
        value={values.link}
        placeholder="모임에 사용될 링크를 입력해주세요"
        onChange={(event) => {
          onChange({ link: event.target.value });
        }}
        onClear={() => {
          onChange({ link: "" });
        }}
        isDestructive={Boolean(errors.link)}
        hintText={errors.link}
      />

      <Input
        id="capacity"
        type="text"
        inputMode="numeric"
        label="모임 정원"
        isRequired
        placeholder="숫자만 입력해주세요"
        value={values.capacity}
        onChange={(event) => {
          onChange({ capacity: event.target.value.replace(/[^0-9]/g, "") });
        }}
        onClear={() => {
          onChange({ capacity: "" });
        }}
        isDestructive={Boolean(errors.capacity)}
        hintText={errors.capacity}
      />

      <Checkbox
        label="비밀 모임으로 생성"
        checked={values.isPrivate}
        onChange={(event) => {
          onChange({ isPrivate: event.target.checked });
        }}
      />

      <div className="space-y-2">
        <p className="text-[14px] font-medium text-gray-800">이미지</p>

        <ImageUploadInput
          size="sm"
          imageSrc={values.previewImageUrl}
          onFileSelect={(file) => {
            onChangeImage(file);
          }}
          onRemove={onRemoveImage}
        />

        {values.imageFile ? (
          <p className="text-sm text-gray-500">{values.imageFile.name}</p>
        ) : null}

        {isImageUploading ? (
          <p className="text-sm text-gray-500">이미지 업로드 중..</p>
        ) : null}

        {!isImageUploading && values.imageUrl && !values.imageFile ? (
          <p className="text-sm text-green-600">이미지 업로드 완료</p>
        ) : null}

        {errors.imageUrl ? (
          <p className="text-error text-sm">{errors.imageUrl}</p>
        ) : null}
      </div>
    </div>
  );
}
