"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { InputCommon } from "@/components/ui/InputCommon";
import { BtnCommon } from "@/components/ui/BtnCommon";
import kakaoIcon from "@/assets/icon/kakao/kakao-logo.svg";
import googleIcon from "@/assets/icon/google/google-logo.svg";
import type { LoginFormValues } from "@/types/index";
import { loginUser } from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 유효성검사
  // 로그인 폼 상태 및 유효성검사 관리 로직
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormValues>({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // setUser 스토어에서 연결
  const setUser = useAuthStore((s) => s.setUser);

  // RHF 내장된 기능으로 제출 시, 유효성검사 통과하면 로직 탐
  // 로그인 성공 시 메인 페이지 이동 로직
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await loginUser({ email: data.email, password: data.password });
      if (res?.ok && res.user) {
        setUser(res.user);
        router.push(returnUrl);
      }
    } catch {
      setError("로그인 실패. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };


  // kakao 로그인
  // 페이지 이동시키면 백엔드에서 리다이렉트 처리해줌 여기서 계정 선택 및 로그인까지 완료 후 콜백페이지로 떨궈줌
  const handleKakaoLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/kakao`;
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <>
      <section
        className="flex min-h-[calc(100vh-48px)] items-center bg-[#F6F7F9] py-6 sm:min-h-[calc(100vh-88px)] sm:py-25"
        aria-labelledby="login-header"
      >
        <div className="w-full px-4 sm:mx-auto sm:max-w-142 sm:px-0">
          <div className="rounded-xl border bg-white px-4 py-6 sm:rounded-[40px] sm:px-16 sm:py-10">
            <h1
              id="login-header"
              className="text-center text-base font-semibold text-gray-900 sm:text-2xl"
            >
              로그인
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-6 pt-10"
            >
              {/* 인풋 : 이메일 */}
              <InputCommon
                label="이메일"
                type="email"
                isRequired
                placeholder="이메일을 입력해주세요."
                inputSize={"sm"}
                {...register("email", {
                  required: "이메일을 입력해주세요.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "이메일 형식이 올바르지 않습니다.",
                  },
                })}
                isDestructive={!!errors.email}
                hintText={errors.email?.message}
                onClear={() => setValue("email", "")}
              />

              {/* 인풋 : 비밀번호 */}
              <InputCommon
                label="비밀번호"
                type="password"
                isRequired
                placeholder="비밀번호를 입력해주세요."
                inputSize={"sm"}
                {...register("password", {
                  required: "비밀번호를 입력해주세요.",
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                    message:
                      "비밀번호는 영문과 숫자를 포함한 8자 이상이어야 합니다.",
                  },
                })}
                isDestructive={!!errors.password}
                hintText={errors.password?.message}
                onClear={() => setValue("password", "")}
              />

              <BtnCommon variant={"default"} size={"md"} type="submit">
                {isLoading ? "로그인 중..." : "로그인"}
              </BtnCommon>
            </form>
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

            <div className="mt-8 mb-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-300"></div>
              <p className="shrink text-[15px] font-medium text-gray-500">
                SNS 계정으로 회원가입
              </p>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <BtnCommon
                className="border border-gray-200 bg-white text-base text-gray-800 hover:bg-white sm:w-1/2"
                size={"fixedSize"}
                onClick={handleGoogleLogin}
              >
                <Image
                  src={googleIcon}
                  width="24"
                  height="24"
                  alt="구글 아이콘"
                />
                <p className="ml-3">구글로 계속하기</p>
              </BtnCommon>
              <BtnCommon
                className="bg-[#FFEE01] text-base text-gray-800 hover:bg-[#FFEE01] sm:w-1/2"
                size={"fixedSize"}
                onClick={handleKakaoLogin}
              >
                <Image
                  src={kakaoIcon}
                  width="24"
                  height="24"
                  alt="카카오 아이콘"
                />
                <p className="ml-3">카카오로 계속하기</p>
              </BtnCommon>
            </div>

            <div className="mt-8 flex items-center justify-center gap-1">
              <p className="font-regular text-sm text-gray-800">
                같이달램이 처음이신가요?
              </p>
              <Link
                href="/signup"
                className="text-sm font-semibold text-green-600 underline"
              >
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
