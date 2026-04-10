"use client";

import { InputCommon } from "@/components/ui/InputCommon";
import { BtnCommon } from "@/components/ui/BtnCommon";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signupUser } from "@/api/client/auth";
import { ToastCommon } from "@/components/ui/ToastCommon";
import { useForm } from "react-hook-form";
import type { SignUpFormValues } from "@/types";
import React, { useState } from "react";
import { DeleteModal } from "@/components/ui/DeleteModal";
import ModalBase from "@/components/ui/ModalBase";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      introduce: "",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);

    try {
      const result = await signupUser(data);

      if (result.ok) {
        setIsOpenModal(true);
        // ToastCommon({ message: "회원가입이 완료되었습니다.", size: "sm" });

      } else {
        setIsLoading(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        ToastCommon({
          message: "이미 가입된 이메일입니다. 로그인해 주세요.",
          size: "sm",
        });
      } else {
        ToastCommon({
          message: "회원가입에 실패했습니다. 다시 시도해 주세요.",
          size: "sm",
        });
      }
      setIsLoading(false);
    }
  };

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleCloseModal = () => {
    setIsOpenModal(false);
    router.push("/login");
  };


  return (
    <section
      className="my-10 flex h-[calc(100dvh-63px)] items-center px-6 lg:h-[calc(100dvh-72px)] xl:my-0 2xl:px-0"
      aria-labelledby="sign-up-header"
    >
      <div className="w-full sm:mx-auto sm:max-w-[540px]">
        <div className="rounded-[32px] border border-slate-100 bg-white px-8 py-12 shadow-2xl shadow-slate-200/40 sm:rounded-[48px] sm:px-16 sm:py-16">
          <div className="mb-12 flex flex-col items-center gap-1">
            <div className="bg-main-purple mb-2 h-1.5 w-8 rounded-full" />
            <h1
              id="sign-up-header"
              className="text-center text-3xl font-black tracking-tighter text-slate-950 uppercase"
            >
              Join Us
            </h1>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-5"
          >
            <InputCommon
              label="Name"
              type="text"
              isRequired
              placeholder="이름을 입력해주세요."
              className="!h-12"
              {...register("name", { required: "이름을 입력해주세요." })}
              isDestructive={!!errors.name}
              hintText={errors.name?.message}
            />

            <InputCommon
              label="Email"
              type="email"
              isRequired
              placeholder="이메일을 입력해주세요."
              className="!h-12"
              {...register("email", {
                required: "이메일을 입력해주세요.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "이메일 형식이 올바르지 않습니다.",
                },
              })}
              isDestructive={!!errors.email}
              hintText={errors.email?.message}
            />

            <InputCommon
              label="Password"
              type="password"
              isRequired
              placeholder="비밀번호를 입력해주세요."
              className="!h-12"
              {...register("password", {
                required: "비밀번호를 입력해주세요.",
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                  message: "영문/숫자 포함 8자 이상",
                },
              })}
              isDestructive={!!errors.password}
              hintText={errors.password?.message}
              onClear={() => setValue("password", "")}
            />

            <InputCommon
              label="Confirm Password"
              type="password"
              isRequired
              placeholder="비밀번호 확인"
              className="!h-12"
              {...register("passwordConfirm", {
                required: "비밀번호 확인을 입력해주세요.",
                validate: (value) => {
                  const passwordValue = getValues("password");
                  return (
                    value === passwordValue || "비밀번호가 일치하지 않습니다."
                  );
                },
              })}
              isDestructive={!!errors.passwordConfirm}
              hintText={errors.passwordConfirm?.message}
              onClear={() => setValue("passwordConfirm", "")}
            />

            <InputCommon
              label="Introduction"
              type="text"
              placeholder="한줄소개 (20자 이내)"
              className="!h-12"
              {...register("introduce", {
                validate: (value) => {
                  if (!value) return true;
                  return value.length <= 20 || "20자 이하로 입력해주세요.";
                },
              })}
              isDestructive={!!errors.introduce}
              hintText={errors.introduce?.message}
              onClear={() => setValue("introduce", "")}
            />

            <BtnCommon
              variant={"default"}
              size={"md"}
              type="submit"
              disabled={isLoading}
              className="mt-4 h-12 !rounded-xl font-black tracking-widest transition-all"
            >
              {isLoading ? "가입 중..." : "회원가입"}
            </BtnCommon>
          </form>

          <div className="mt-12 flex flex-col items-center justify-center gap-2">
            <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              이미 계정이 있으신가요?
            </p>
            <Link
              href="/login"
              className="text-main-purple focus-visible:ring-black text-sm font-black tracking-widest uppercase underline underline-offset-4 transition-colors hover:text-slate-900 focus-visible:ring-2"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isOpenModal}
        onOpenChange={handleCloseModal}
        onConfirm={handleCloseModal}
        confirmButtonLabel="확인"
        description="회원가입이 완료되었습니다."
        subDescription=" "
      />

    </section>
  );
}
