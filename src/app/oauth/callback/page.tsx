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
          router.refresh(); // 서버 컴포넌트 캐시 갱신 안되는거때문에 fetchMe 가 실행안됨
          window.location.replace("/");
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
      <p className="text-gray-500">로그인 처리 중...</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-500">로그인 처리 중...</p>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
