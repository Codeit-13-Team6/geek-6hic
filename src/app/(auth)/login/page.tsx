"use client";

import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <section
      className="flex min-h-[calc(100vh-48px)] items-center bg-[#F6F7F9] py-6 sm:min-h-[calc(100vh-88px)] sm:py-25"
      aria-labelledby="login-header"
    >
      <div className="w-full px-4 sm:mx-auto sm:max-w-142 sm:px-0">
        <div className="rounded-xl border bg-white px-4 py-6 sm:rounded-[40px] sm:px-16 sm:py-10">
          <LoginForm  />
        </div>
      </div>
    </section>
  );
}
