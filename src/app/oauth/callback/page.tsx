"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";


function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      router.replace("/login");
      return;
    }

    const handleCallback = async () => {
      try {
        const { data } = await axios.post(
          "/api/auth/token",
          { accessToken, refreshToken },
          { withCredentials: true },
        );

        if (data.ok) {
          const returnUrl = document.cookie
            .split("; ")
            .find((c) => c.startsWith("oauthReturnUrl="))
            ?.split("=")
            .slice(1)
            .join("=");
          // 쿠키 삭제
          document.cookie = "oauthReturnUrl=;path=/;max-age=0";
          router.refresh();
          const decoded = returnUrl ? decodeURIComponent(returnUrl) : "/";
          const isLoginPage = new URL(decoded, window.location.origin).pathname.startsWith("/login");
          window.location.replace(isLoginPage ? "/" : decoded);
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      }
    };
    handleCallback();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">로그인 중...</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-500">로그인 중...</p>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
