"use client";

import { loginUser, type LoginResult } from "@/api/auth";
import { useState } from "react";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<LoginResult | undefined> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUser({ email, password });
      return result;
    } catch {
      setError("로그인 실패. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error };
}
