"use client";

import axios from "axios";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { MemberProviderProps } from "@/types";
import type { User } from "@/types";
import { getUser } from "@/api/client/user";
import { logoutUser } from "@/api/client/auth";

interface Props extends MemberProviderProps {
  initialUser?: Pick<User, "id" | "name" | "image"> | null;
}

export function MemberProvider({ children, initialUser }: Props) {
  useEffect(() => {
    let cancelled = false;

    if (typeof initialUser === "undefined") {
      const bootstrapAuth = async () => {
        try {
          const me = await getUser();
          if (cancelled) return;
          useAuthStore.getState().setUser(me);
        } catch (error) {
          if (cancelled) return;

          // 인증 실패는 status(401) 기준으로만 세션 정리
          // 네트워크 오류/일시 5xx에서는 기존 세션 상태를 유지합니다.
          const status = axios.isAxiosError(error)
            ? error.response?.status
            : undefined;
          const code = axios.isAxiosError(error)
            ? (error.response?.data as { code?: string } | undefined)?.code
            : undefined;

          if (status === 401) {
            if (code === "AUTH_SYNC_REQUIRED") {
              // 로그인/회원가입 화면에서는 sync 재진입을 막아 무한 루프를 방지합니다.
              if (
                window.location.pathname === "/login" ||
                window.location.pathname === "/signup" ||
                window.location.pathname === "/oauth/kakao"
              ) {
                useAuthStore.getState().clearAuth();
                return;
              }
              const nextPath = `${window.location.pathname}${window.location.search}`;
              window.location.href = `/api/auth/sync?next=${encodeURIComponent(nextPath)}`;
              return;
            }
            await logoutUser().catch(() => {
              return;
            });
            if (cancelled) return;
            useAuthStore.getState().clearAuth();
          }
        } finally {
          if (cancelled) return;
          // setUser/clearAuth에서 false로 내려주지만, 예외 경로 안전망으로 한 번 더 보장
          useAuthStore.getState().setAuthLoading(false);
        }
      };

      void bootstrapAuth();
      return () => {
        cancelled = true;
      };
    }

    useAuthStore.setState((prev) => {
      if (!initialUser) {
        return {
          user: null,
          isAuthLoading: false,
        };
      }

      const prevUser = prev.user;

      // layout에서 내려오는 initialUser는 최소 필드(id/name/image)라
      // 동일 유저의 기존 상세 필드(email/companyName)를 덮어쓰지 않도록 merge 처리.
      if (prevUser && prevUser.id === initialUser.id) {
        return {
          user: {
            ...prevUser,
            ...initialUser,
          } as User,
          isAuthLoading: false,
        };
      }

      return {
        user: initialUser as User,
        isAuthLoading: false,
      };
    });

    return () => {
      cancelled = true;
    };
  }, [initialUser?.id, initialUser?.name, initialUser?.image]);

  return <>{children}</>;
}
