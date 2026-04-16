"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { bindAuthTokens, loginWithKakaoCode } from "@/shared/api/client";
import { useAuthStore } from "@/infra/store/useAuthStore";

function KakaoOAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      router.replace("/login");
      return;
    }

    const handleCallback = async () => {
      try {
        const oauthResult = await loginWithKakaoCode(code);
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

        const returnUrl = document.cookie
          .split("; ")
          .find((c) => c.startsWith("oauthReturnUrl="))
          ?.split("=")
          .slice(1)
          .join("=");
        document.cookie = "oauthReturnUrl=;path=/;max-age=0";
        const decoded = returnUrl ? decodeURIComponent(returnUrl) : "/";
        const pathname = new URL(decoded, window.location.origin).pathname;
        const isLoginPage =
          pathname.startsWith("/login") || pathname.startsWith("/signup");

        window.location.replace(isLoginPage ? "/" : decoded);
      } catch {
        router.replace("/login");
      }
    };

    void handleCallback();
  }, [router, searchParams, setUser]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">로그인 중...</p>
    </div>
  );
}

export default function KakaoOAuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-500">로그인 중...</p>
        </div>
      }
    >
      <KakaoOAuthContent />
    </Suspense>
  );
}
