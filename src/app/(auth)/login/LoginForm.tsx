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
import type { LoginFormValues } from "@/types";
import { loginUser } from "@/api/client";
import { useAuthStore } from "@/store/useAuthStore";

interface LoginFormProps {
  onSuccess?: () => void;
  title?: string;
}

export default function LoginForm({
  onSuccess,
  title = "로그인",
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<
    "google" | "kakao" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

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

  const setUser = useAuthStore((s) => s.setUser);

  const onSubmit = async (data: LoginFormValues) => {
    console.log(data, returnUrl, 'gg ');
    setIsLoading(true);
    setError(null);

    try {
      const res = await loginUser({
        email: data.email,
        password: data.password,
      });
      if (res?.ok && res.user) {
        console.log(returnUrl);
        setUser(res.user);
        if (onSuccess) {
          onSuccess();
        }
        console.log(returnUrl);
        router.push(returnUrl);
      }
    } catch {
      setError("로그인 실패. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveReturnUrl = () => {
    document.cookie = `oauthReturnUrl=${encodeURIComponent(window.location.href)};path=/;max-age=600`;
  };

  const handleKakaoLogin = () => {
    setIsOAuthLoading("kakao");
    saveReturnUrl();
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/kakao`;
  };

  const handleGoogleLogin = () => {
    setIsOAuthLoading("google");
    saveReturnUrl();
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div>
      <h1 className="text-center text-base font-semibold text-gray-900 sm:text-2xl">
        {title}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-6 pt-10"
      >
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
              message: "비밀번호는 영문과 숫자를 포함한 8자 이상이어야 합니다.",
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
          disabled={!!isOAuthLoading}
        >
          <Image src={googleIcon} width="24" height="24" alt="구글 아이콘" />
          <p className="ml-3">
            {isOAuthLoading === "google" ? "이동 중..." : "구글로 계속하기"}
          </p>
        </BtnCommon>
        <BtnCommon
          className="bg-[#FFEE01] text-base text-gray-800 hover:bg-[#FFEE01] sm:w-1/2"
          size={"fixedSize"}
          onClick={handleKakaoLogin}
          disabled={!!isOAuthLoading}
        >
          <Image src={kakaoIcon} width="24" height="24" alt="카카오 아이콘" />
          <p className="ml-3">
            {isOAuthLoading === "kakao" ? "이동 중..." : "카카오로 계속하기"}
          </p>
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
  );
}
