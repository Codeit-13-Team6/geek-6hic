"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import profileImg from "@/assets/img/profile/female1-m.jpg";
import editImg from "@/assets/icon/edit/edit-sm.svg";
import { updateUserProfile } from "@/api/user";
import { User, UserProfileUpdateProps } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import ModalBase from "@/components/features/modal/ModalBase";
import { InputCommon } from "@/components/ui/InputCommon";
import { BtnCommon } from "@/components/ui/BtnCommon";
import { ImageUploadInput } from "@/components/features/upload/ImageUploadInput";

export default function ProfileSection() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((s) => s.setUser);

  const profileForm = useForm<UserProfileUpdateProps>({
    defaultValues: { name: "", email: "", companyName: "", image: null },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name ?? "",
        email: user.email ?? "",
        companyName: user.companyName ?? "",
        image: user.image ?? null,
      });
    }
  }, [user]);

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (data: UserProfileUpdateProps) => updateUserProfile(data),
    onSuccess: (data: User) => {
      setUser(data);
      setIsEditModalOpen(false);
    },
  });

  const onSubmitProfile = profileForm.handleSubmit(({ email, image, ...data }) => {
    updateProfile({
      ...data,
      ...(image && { image }),
    });
  });

  return (
    <>
      <article className="border-main-green-400 bg-main-green-100 flex h-[100px] w-full shrink-0 items-center rounded-[24px] border px-4 md:h-[124px] md:px-6 lg:h-[370px] lg:w-[282px] lg:flex-col lg:justify-center lg:py-10">
        <div className="flex shrink-0 items-center gap-2 lg:flex-col lg:gap-6">
          <div className="relative size-[30px] overflow-hidden rounded-full sm:size-[36px] lg:size-[114px]">
            <Image
              src={user?.image ?? profileImg}
              alt="프로필 이미지"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-1 lg:mb-2">
            <span className="text-sm font-bold text-gray-800 sm:text-lg lg:text-xl">
              {user?.name}
            </span>
            <Image
              src={editImg}
              alt="수정 이미지"
              className="size-5 cursor-pointer sm:size-7"
              onClick={() => setIsEditModalOpen(true)}
            />
          </div>
        </div>

        <div className="bg-main-green-400/50 mx-4 h-12 w-[1px] shrink-0 md:mx-6 lg:hidden" />

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 lg:items-center lg:gap-6">
          <div className="lg:bg-gradient-200 flex items-center lg:rounded-[24px] lg:px-4 lg:py-1.5">
            <span className="w-[52px] shrink-0 text-xs font-medium text-gray-500 sm:text-sm lg:hidden">
              이메일
            </span>
            <span className="sm:text-md ml-3 truncate text-xs font-medium text-gray-800 sm:text-sm lg:ml-0 lg:text-gray-600">
              {user?.email}
            </span>
          </div>
          <div className="flex items-center lg:flex-col lg:gap-1">
            <span className="w-[52px] shrink-0 text-xs font-medium text-gray-500 sm:text-sm lg:w-auto lg:text-base">
              한줄소개
            </span>
            <span className="ml-3 truncate text-xs font-medium text-gray-800 sm:text-sm lg:ml-0 lg:text-gray-800">
              {user?.companyName}
            </span>
          </div>
        </div>
      </article>

      <ModalBase
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="프로필수정하기"
        disablePointerDismissal
        contentClassName={"py-[32px] px-[24px] sm:p-[48px] sm:max-w-[544px]"}
        titleClassName="text-2xl text-gray-900 font-semibold"
      >
        <form onSubmit={onSubmitProfile}>
          <section className="mt-[32px] flex flex-col gap-4 sm:mt-[48px]">
            <Controller
              name="image"
              control={profileForm.control}
              render={({ field }) => (
                <ImageUploadInput
                  type="profile"
                  size="sm"
                  className="mx-auto"
                  imageSrc={field.value ?? undefined}
                  onFileSelect={(file) => {
                    const url = URL.createObjectURL(file);
                    field.onChange(url);
                  }}
                  onRemove={() => field.onChange(null)}
                />
              )}
            />
            <Controller
              name="name"
              control={profileForm.control}
              rules={{ required: "이름을 입력해주세요." }}
              render={({ field, fieldState }) => (
                <InputCommon
                  {...field}
                  label="이름"
                  isRequired
                  placeholder="이름을 입력해주세요."
                  onClear={() => field.onChange("")}
                  isDestructive={!!fieldState.error}
                  hintText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={profileForm.control}
              rules={{
                required: "이메일을 입력해주세요.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "올바른 이메일 형식이 아닙니다.",
                },
              }}
              render={({ field, fieldState }) => (
                <InputCommon
                  {...field}
                  label="이메일"
                  isRequired
                  placeholder="이메일을 입력해주세요."
                  onClear={() => field.onChange("")}
                  isDestructive={!!fieldState.error}
                  hintText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="companyName"
              control={profileForm.control}
              render={({ field, fieldState }) => (
                <InputCommon
                  {...field}
                  label="한줄소개"
                  placeholder="한줄소개를 입력해주세요."
                  onClear={() => field.onChange("")}
                  isDestructive={!!fieldState.error}
                  hintText={fieldState.error?.message}
                />
              )}
            />
            <div className="flex flex-row gap-[16px] pt-[40px] sm:pt-[56px]">
              <BtnCommon
                variant={"outline"}
                size={"md"}
                className="flex-1"
                onClick={() => setIsEditModalOpen(false)}
              >
                취소
              </BtnCommon>
              <BtnCommon size={"md"} className="flex-1" type="submit" disabled={isPending}>
                수정하기
              </BtnCommon>
            </div>
          </section>
        </form>
      </ModalBase>
    </>
  );
}
