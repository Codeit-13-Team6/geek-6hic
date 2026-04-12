"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { uploadProfileImage } from "@/api/client/user";
import { User, UserProfileUpdateProps } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import ModalBase from "@/components/ui/ModalBase";
import { InputCommon } from "@/components/ui/InputCommon";
import { BtnCommon } from "@/components/ui/BtnCommon";
import { ImageUploadInput } from "@/components/ui/ImageUploadInput";
import { Settings2 } from "lucide-react";
import FallbackImage from "@/components/img/FallbackImage";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useUpdateProfile } from "@/hooks/queries/useUser";

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
  canEdit = false,
}: ProfileSectionProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);

  const storeUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // 내 프로필이면 스토어(mutation 후 최신) 우선, 타인 프로필이면 initialUser만
  const displayUser = canEdit ? (storeUser ?? initialUser) : initialUser;

  const profileForm = useForm<UserProfileUpdateProps>({
    defaultValues: { name: "", email: "", companyName: "", image: null },
  });

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const onSubmitProfile = profileForm.handleSubmit(({ image, ...data }) => {
    // 이미지 업로드는 ImageUploadInput 내부에서 완료됨 — image는 S3 publicUrl
    updateProfile(
      { ...data, ...(image && { image }) },
      {
        onSuccess: () => setIsEditModalOpen(false),
      },
    );
  });

  const requestCloseModal = () => {
    if (profileForm.formState.isDirty) {
      setIsCloseConfirmOpen(true);
    } else {
      setIsEditModalOpen(false);
    }
  };

  // 서버에서 가져온 최신 initialUser로 store 동기화 (stale 쿠키 덮어쓰기 방지)
  useEffect(() => {
    if (canEdit && initialUser) {
      setUser(initialUser as User);
    }
  }, [initialUser]);

  // 모달 열릴 때마다 최신 displayUser로 폼 동기화
  useEffect(() => {
    if (!displayUser) return;
    profileForm.reset({
      name: displayUser.name ?? "",
      email: displayUser.email ?? "",
      companyName: displayUser.companyName ?? "",
      image: displayUser.image ?? null,
    });
  }, [displayUser, profileForm, isEditModalOpen]);

  return (
    <>
      <article className="flex h-full w-full flex-col items-center gap-6 rounded-[40px] border border-slate-100 bg-white p-8 shadow-sm sm:flex-row sm:gap-8 md:max-lg:min-h-90 lg:flex-col lg:p-8">
        {/* <article className="relative flex h-full w-full flex-col items-center gap-6 overflow-hidden rounded-[40px] border border-slate-100 bg-slate-50 p-8 shadow-md sm:flex-row sm:gap-8 lg:flex-col lg:p-8"> */}
        <div className="relative size-24 shrink-0 overflow-hidden rounded-full ring-4 ring-slate-100 sm:size-20 lg:size-24">
          <FallbackImage
            src={displayUser?.image}
            type="user"
            alt="프로필"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex w-full flex-1 flex-col items-center gap-3 sm:items-start lg:items-center">
          <div className="flex flex-col items-center gap-2 sm:items-start lg:items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold tracking-tight break-all text-slate-950 sm:text-3xl">
                {displayUser?.name || "Sprinter"}
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

          <div className="w-full space-y-3 text-center sm:text-left lg:text-center">
            <div>
              <p className="mb-0.5 text-xs font-black tracking-widest text-slate-400 uppercase">
                Contact
              </p>
              <p className="line-clamp-2 text-sm font-semibold break-all text-slate-600">
                {displayUser?.email}
              </p>
            </div>
            <div>
              <p className="mb-0.5 text-xs font-black tracking-widest text-slate-400 uppercase">
                Intro
              </p>
              <p className="line-clamp-2 text-sm leading-relaxed font-semibold text-slate-600">
                {displayUser?.companyName || "자기소개가 없습니다."}
              </p>
            </div>
          </div>
        </div>
        {/* <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(168,85,247,0.1),transparent_70%)]" /> */}
      </article>

      {/* 편집 모달은 canEdit일 때만 의미 있음 */}
      {canEdit && (
        <ModalBase
          isOpen={isEditModalOpen}
          onOpenChange={(nextIsOpen) => {
            if (!nextIsOpen) requestCloseModal();
          }}
          title="프로필 수정"
          contentClassName="-mt-10 sm:max-w-[520px] rounded-[32px]"
          titleClassName="text-2xl font-black tracking-tighter text-slate-950 uppercase"
          disablePointerDismissal={true}
        >
          <form onSubmit={onSubmitProfile} className="mt-8 flex flex-col gap-6">
            <div className="flex w-full items-center justify-center">
              <Controller
                name="image"
                control={profileForm.control}
                render={({ field }) => (
                  <ImageUploadInput
                    type="profile"
                    size="sm"
                    className="mx-auto"
                    imageSrc={field.value ?? undefined}
                    uploadFn={uploadProfileImage}
                    onUploaded={(url) => field.onChange(url)}
                    onRemove={() => field.onChange(null)}
                  />
                )}
              />
            </div>

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
                onClick={requestCloseModal}
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
      )}
      <ConfirmModal
        isOpen={isCloseConfirmOpen}
        onOpenChange={setIsCloseConfirmOpen}
        onConfirm={() => setIsCloseConfirmOpen(false)}
        onCancel={() => {
          setIsCloseConfirmOpen(false);
          setIsEditModalOpen(false);
        }}
      />
    </>
  );
}
