"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { InputCommon } from "@/components/ui/InputCommon";
import { BtnCommon } from "@/components/ui/BtnCommon";
import kakaoIcon from "@/assets/icon/kakao/kakao-logo.svg";
import googleIcon from "@/assets/icon/google/google-logo.svg";
import type { LoginFormValues } from "@/types";
import { bindAuthTokens, loginUser, loginWithGoogleToken } from "@/api/client";
import { requestGoogleAccessToken } from "@/lib/googleAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import { ToastCommon } from "@/components/ui/ToastCommon";

interface LoginFormProps {
  onSuccess?: () => void;
  title?: string;
}

export default function LoginForm({
  onSuccess,
  title = "로그인",
}: LoginFormProps) {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<
    "google" | "kakao" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const closeModal = useLoginModalStore((s) => s.closeLoginModal);

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
    setIsLoading(true);
    setError(null);

    try {
      const res = await loginUser({
        email: data.email,
        password: data.password,
      });

      if (res?.ok) {
        if (res.user) {
          setUser(res.user);
        }
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.replace(returnUrl);
        }
      }
    } catch {
      setError("로그인 실패. 다시 시도해주세요.");
      ToastCommon({
        message: "로그인 실패. 다시 시도해주세요.",
        type: "error",
      });

      setIsLoading(false);
    }
  };

  const saveReturnUrl = () => {
    document.cookie = `oauthReturnUrl=${encodeURIComponent(window.location.href)};path=/;max-age=600`;
  };

  const handleKakaoLogin = () => {
    setIsOAuthLoading("kakao");
    saveReturnUrl();

    const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const kakaoRedirectUri = `${window.location.origin}/oauth/kakao`;

    if (!kakaoClientId) {
      setError("Kakao 로그인 설정이 올바르지 않습니다.");
      ToastCommon({
        message: "Kakao 로그인 설정이 올바르지 않습니다.",
        type: "error",
      });
      setIsOAuthLoading(null);
      return;
    }

    const kakaoAuthorizeUrl = new URL(
      "https://kauth.kakao.com/oauth/authorize",
    );
    kakaoAuthorizeUrl.searchParams.set("client_id", kakaoClientId);
    kakaoAuthorizeUrl.searchParams.set("redirect_uri", kakaoRedirectUri);
    kakaoAuthorizeUrl.searchParams.set("response_type", "code");

    window.location.href = kakaoAuthorizeUrl.toString();
  };

  const handleGoogleLogin = () => {
    setIsOAuthLoading("google");
    setError(null);

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      setError("Google 로그인 설정이 올바르지 않습니다.");
      ToastCommon({
        message: "Google 로그인 설정이 올바르지 않습니다.",
        type: "error",
      });
      setIsOAuthLoading(null);
      return;
    }

    void (async () => {
      try {
        // 1. 구글에서 액세스 토큰 요청
        const googleAccessToken =
          await requestGoogleAccessToken(googleClientId);
        // 2. 액세스 토큰으로 백엔드에서 인증 처리 및 JWT 토큰 발급
        const oauthResult = await loginWithGoogleToken(googleAccessToken);
        // 3. 발급된 토큰으로 클라이언트 로그인 처리
        const data = await bindAuthTokens({
          accessToken: oauthResult.accessToken,
          refreshToken: oauthResult.refreshToken,
        });

        if (!data.ok) {
          throw new Error("login_failed");
        }

        if (data.user) {
          setUser(data.user);
        }

        if (onSuccess) {
          onSuccess();
        } else {
          window.location.replace(returnUrl);
        }
      } catch {
        setError("Google 로그인 실패. 다시 시도해주세요.");
        ToastCommon({
          message: "Google 로그인 실패. 다시 시도해주세요.",
          type: "error",
        });
        setIsOAuthLoading(null);
      }
    })();
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col items-center gap-1">
        <div className="bg-main-purple mb-2 h-1.5 w-8 rounded-full" />
        <h1 className="text-center text-3xl font-black tracking-tighter text-slate-950 uppercase">
          {title}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <InputCommon
          label="이메일"
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
          onClear={() => setValue("email", "")}
        />

        <InputCommon
          label="비밀번호"
          type="password"
          isRequired
          placeholder="비밀번호를 입력해주세요."
          className="!h-12"
          {...register("password", {
            required: "비밀번호를 입력해주세요.",
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
              message: "영문/숫자 포함 8자 이상",
            },
          })}
          isDestructive={!!errors.password}
          hintText={errors.password?.message}
          onClear={() => setValue("password", "")}
        />

        <BtnCommon
          variant={"default"}
          size={"md"}
          type="submit"
          disabled={isLoading}
          onClick={() => {}}
          className="mt-2 h-12 rounded-xl! font-black tracking-widest transition-transform active:scale-95"
        >
          로그인
        </BtnCommon>
      </form>

      {error && (
        <p className="mt-4 text-center text-[11px] font-bold text-red-500">
          {error}
        </p>
      )}

      <div className="mt-8 mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-50"></div>
        <span className="text-[9px] font-black tracking-widest text-slate-300 uppercase">
          간편 로그인
        </span>
        <div className="h-px flex-1 bg-slate-50"></div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-100 bg-white font-bold tracking-tight text-slate-700/80 transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50"
          onClick={handleGoogleLogin}
          disabled={!!isOAuthLoading}
        >
          <Image src={googleIcon} width="20" height="20" alt="" />
          {isOAuthLoading === "google" ? (
            <span className="animate-pulse text-[13px] font-bold text-slate-400">
              로그인 중...
            </span>
          ) : (
            "Google"
          )}
        </button>

        <button
          type="button"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#FEE500] font-bold tracking-tight text-black/80 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          onClick={handleKakaoLogin}
          disabled={!!isOAuthLoading}
        >
          <Image src={kakaoIcon} width="20" height="20" alt="" />
          {isOAuthLoading === "kakao" ? (
            <span className="ml-2 animate-pulse text-[10px] font-bold text-slate-600">
              로그인 중...
            </span>
          ) : (
            "Kakao"
          )}
        </button>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
          계정이 아직 없으신가요?
        </p>
        <Link
          href="/signup"
          onClick={closeModal}
          className="text-main-purple text-[11px] font-black tracking-widest uppercase underline underline-offset-4 transition-colors hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-black"
        >
          회원가입
        </Link>
      </div>
    </div>
  );
}
