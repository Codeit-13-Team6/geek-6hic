"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import profileImg from "@/assets/img/profile/female1-m.jpg";
import { updateUserProfile } from "@/api/client/user";
import { User, UserProfileUpdateProps } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import ModalBase from "@/components/ui/ModalBase";
import { InputCommon } from "@/components/ui/InputCommon";
import { BtnCommon } from "@/components/ui/BtnCommon";
import { ImageUploadInput } from "@/components/ui/ImageUploadInput";
import { Settings2 } from "lucide-react";
import FallbackImage from "@/components/img/FallbackImage";

interface ProfileSectionProps {
  initialUser?: {
    id: number;
    teamId?: string;
    name: string;
    image: string | null;
    email: string;
    companyName: string;
  } | null;
  canEdit?: boolean;
}

export default function ProfileSection({
  initialUser,
  canEdit,
}: ProfileSectionProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const storeUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((s) => s.setUser);
  const user = canEdit ? (storeUser ?? initialUser) : initialUser;

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
  }, [user, profileForm, isEditModalOpen]);

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (data: UserProfileUpdateProps) => updateUserProfile(data),
    onSuccess: (data: User) => {
      setUser(data);
      setIsEditModalOpen(false);
    },
  });

  const onSubmitProfile = profileForm.handleSubmit(({ image, ...data }) => {
    updateProfile({ ...data, ...(image && { image }) });
  });

  return (
    <>
      <article className="flex h-full w-full flex-col items-center gap-6 rounded-[40px] border border-slate-100 bg-white p-8 shadow-xs sm:flex-row sm:gap-8 lg:flex-col lg:p-8">
        {/* 이미지: 모바일에서 상단 중앙, sm에서 왼쪽, lg에서 다시 상단 */}
        <div className="relative size-24 shrink-0 overflow-hidden rounded-full ring-4 ring-slate-100 sm:size-20 lg:size-24">
          <FallbackImage
            src={user?.image}
            type="user"
            alt="프로필"
            fill
            className="object-cover"
          />
        </div>

        {/* 정보 컨텐츠 영역 */}
        <div className="flex w-full flex-1 flex-col items-center gap-5 sm:items-start lg:items-center">
          <div className="flex flex-col items-center gap-2 sm:items-start lg:items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold tracking-tight break-all text-slate-950 sm:text-3xl">
                {user?.name || "Sprinter"}
              </h2>
              {canEdit && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="hover:text-main-purple cursor-pointer text-slate-300 transition-colors"
                >
                  <Settings2 size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="h-[1px] w-full bg-slate-50" />

          {/* 텍스트 정렬: 모바일 중앙, sm 왼쪽, lg 중앙 */}
          <div className="w-full space-y-3 text-center sm:text-left lg:text-center">
            <div>
              <p className="mb-0.5 text-xs font-black tracking-widest text-slate-400 uppercase">
                Contact
              </p>
              <p className="line-clamp-2 text-sm font-semibold break-all text-slate-600">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-0.5 text-xs font-black tracking-widest text-slate-400 uppercase">
                Intro
              </p>
              <p className="line-clamp-2 text-sm leading-relaxed font-semibold text-slate-600">
                {user?.companyName || "자기소개가 없습니다."}
              </p>
            </div>
          </div>
        </div>
      </article>

      <ModalBase
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="프로필 수정"
        contentClassName="-mt-10 sm:max-w-[520px] rounded-[32px]"
        titleClassName="text-2xl font-black tracking-tighter text-slate-950 uppercase"
      >
        <form onSubmit={onSubmitProfile} className="mt-8 flex flex-col gap-6">
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

          <div className="space-y-5">
            <Controller
              name="name"
              control={profileForm.control}
              rules={{ required: "이름을 입력해주세요." }}
              render={({ field, fieldState }) => (
                <InputCommon
                  {...field}
                  label="Display Name"
                  className="focus:!border-main-purple !rounded-xl !border-slate-100 !bg-slate-50 focus:!bg-white"
                  isRequired
                  onClear={() => field.onChange("")}
                  isDestructive={!!fieldState.error}
                  hintText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={profileForm.control}
              rules={{ required: "이메일을 입력해주세요." }}
              render={({ field, fieldState }) => (
                <InputCommon
                  {...field}
                  label="Email Address"
                  className="focus:!border-main-purple !rounded-xl !border-slate-100 !bg-slate-50 focus:!bg-white"
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
                  label="Introduction"
                  className="focus:!border-main-purple !rounded-xl !border-slate-100 !bg-slate-50 focus:!bg-white"
                  placeholder="한줄소개를 입력해주세요."
                  onClear={() => field.onChange("")}
                  isDestructive={!!fieldState.error}
                  hintText={fieldState.error?.message}
                />
              )}
            />
          </div>

          <div className="flex gap-4 pt-8">
            <BtnCommon
              variant="teritary"
              className="flex-1 rounded-2xl border-slate-200 font-black"
              onClick={() => setIsEditModalOpen(false)}
            >
              취소
            </BtnCommon>
            <BtnCommon
              variant="default"
              className="flex-1 rounded-2xl font-black"
              type="submit"
              disabled={isPending}
            >
              저장
            </BtnCommon>
          </div>
        </form>
      </ModalBase>
    </>
  );
}
