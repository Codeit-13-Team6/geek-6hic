import axios from "axios";
import { NextResponse } from "next/server";
import type { User } from "@/types";
import { setAuthCookies } from "@/lib/auth/cookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export async function createAuthSuccessResponse(tokens: AuthTokens) {
  const { data: meData } = await axios.get<User>(`${API_BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${tokens.accessToken}` },
  });

  const response = NextResponse.json({ ok: true, user: meData });
  setAuthCookies(response, tokens);

  return response;
}
