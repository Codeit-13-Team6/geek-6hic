import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <section
      className="flex min-h-[calc(100vh-80px)] items-center lg:-mt-12"
      aria-labelledby="login-header"
    >
      <div className="w-full px-6 sm:mx-auto sm:max-w-[480px] sm:px-0">
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
