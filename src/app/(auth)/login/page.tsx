"use client";
import { useLogin } from "@/hooks/useLogin";
import { InputCommon } from "@/components/common/InputCommon";
import { BtnCommon } from "@/components/common/BtnCommon";
import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import kakaoIcon from "@/assets/icon/kakao/kakao-logo.svg";
import googleIcon from "@/assets/icon/google/google-logo.svg";

export default function Login() {
  const { handleLogin, isLoading, error } = useLogin();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await handleLogin(email, password); // 로그인 요청 실행

    if (res?.ok) {
      router.push("/");
    }
  };

  return (
    <>
      <section
        className="flex min-h-[calc(100vh-48px)] items-center bg-[#F6F7F9] py-6 md:min-h-[calc(100vh-88px)] md:py-25"
        aria-labelledby="login-header"
      >
        <div className="w-full px-4 md:mx-auto md:max-w-142 md:px-0">
          <div className="rounded-xl border bg-white px-4 py-6 md:rounded-[40px] md:px-16 md:py-10">
            <h1
              id="login-header"
              className="text-center text-base font-semibold text-gray-900 md:text-2xl"
            >
              로그인
            </h1>
            <form className="flex flex-col gap-6 pt-10" onSubmit={onSubmit}>
              <InputCommon
                label="이메일"
                type="email"
                isRequired
                placeholder="이메일을 입력해주세요."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onClear={() => setEmail("")}
                inputSize={"sm"}
                className="md:text-base"
              />
              <InputCommon
                label="비밀번호"
                type="password"
                isRequired
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onClear={() => setPassword("")}
                inputSize={"sm"}
                className="md:text-base"
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
            <div className="flex flex-col gap-3 md:flex-row">
              <BtnCommon
                className={`border border-gray-200 bg-white text-base text-gray-800 md:w-1/2`}
                size={"fixedSize"}
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
                className="bg-[#FFEE01] text-base text-gray-800 md:w-1/2"
                size={"fixedSize"}
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
