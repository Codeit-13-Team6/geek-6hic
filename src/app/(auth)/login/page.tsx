'use client'

import { InputCommon } from "@/components/common/InputCommon";
import { BtnCommon } from "@/components/common/BtnCommon";
import { useState } from "react";
import Link from "next/link"
import Image from "next/image";
import kakaoIcon from "@/assets/icon/kakao/kakao-logo.svg";
import googleIcon from "@/assets/icon/google/google-logo.svg";

// 유효성검사
import { useForm } from 'react-hook-form';
import type { LoginFormValues } from '@/types/index';

export default function Login() {

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormValues>({
    // mode: 'onChange', // 입력할 때마다, 검증
    mode: 'onSubmit', // 제출시에, 검증
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // RHF 내장된 기능으로 제출 시, 유효성검사 통과하면 로직 탐
  const onSubmit = async (data: LoginFormValues) => {
    console.log('login submit:', data);
  };

  return (
    <>
      <section className="py-6 md:py-25 min-h-[calc(100vh-48px)] md:min-h-[calc(100vh-88px)] flex items-center bg-[#F6F7F9]" aria-labelledby="login-header">
        <div className="px-4 md:px-0 md:max-w-142 w-full md:mx-auto">
          <div className="py-6 px-4 md:py-10 md:px-16 bg-white rounded-xl md:rounded-[40px] border">
            <h1 id="login-header" className="text-center text-base md:text-2xl text-gray-900 font-semibold">로그인</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className='flex flex-col gap-6 pt-10'
            >

              {/* 인풋 : 이메일 */}
              <InputCommon
                label="이메일"
                type="email"
                isRequired
                placeholder="이메일을 입력해주세요."
                inputSize={"sm"}
                {...register('email', {
                  required: '이메일을 입력해주세요.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: '이메일 형식이 올바르지 않습니다.',
                  },
                })}
                isDestructive={!!errors.email}
                hintText={errors.email?.message}
                onClear={() => setValue('email', '')}
              />
              
              {/* 인풋 : 비밀번호 */}
              <InputCommon
                label="비밀번호"
                type="password"
                isRequired
                placeholder="비밀번호를 입력해주세요."
                inputSize={"sm"}
                {...register('password', {
                  required: '비밀번호를 입력해주세요.',
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                    message: '비밀번호는 영문과 숫자를 포함한 8자 이상이어야 합니다.',
                  },
                })}
                isDestructive={!!errors.password}
                hintText={errors.password?.message}
                onClear={() => setValue('password', '')}
              />
              <BtnCommon variant={"default"} size={"md"} type="submit" children="로그인" />
            </form>
            <div className="flex items-center gap-4 mt-8 mb-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <p className="shrink text-[15px] font-medium text-gray-500">SNS 계정으로 회원가입</p>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <BtnCommon className={`bg-white border md:w-1/2 border-gray-200 text-gray-800 text-base hover:bg-white`} size={"fixedSize"}>
                <Image src={googleIcon} width="24" height="24" alt="구글 아이콘" />
                <p className="ml-3">구글로 계속하기</p>
              </BtnCommon>
              <BtnCommon className="bg-[#FFEE01] md:w-1/2 text-gray-800 text-base hover:bg-[#FFEE01]" size={"fixedSize"}>
                <Image src={kakaoIcon} width="24" height="24" alt="카카오 아이콘" />
                <p className="ml-3">카카오로 계속하기</p>
              </BtnCommon>
            </div>
            <div className="flex gap-1 justify-center items-center mt-8">
              <p className="text-sm font-regular text-gray-800">같이달램이 처음이신가요?</p>
              <Link href="/signup" className="text-sm text-green-600 font-semibold underline">회원가입</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}