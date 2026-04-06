import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function Login() {
  return (
    // calc 계산 -> 100vh - 헤더 높이 - 레이아웃 패딩y값
    <section className="flex flex-col px-6 2xl:px-0 items-center justify-center h-[calc(100dvh-63px)] lg:h-[calc(100dvh-72px)]">
      <div className="w-full sm:mx-auto sm:max-w-[480px] sm:px-0">
        <div className="rounded-[32px] border border-slate-100 bg-white px-8 py-10 shadow-xl shadow-slate-200/40 sm:px-12 sm:py-12">
          <Suspense
            fallback={
              <div className="py-20 text-center text-xs font-black tracking-widest text-slate-300">
                LOADING...
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
