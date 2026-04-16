import { cache } from "react";
import type { User } from "@/types";
import { serverFetch } from "@/lib/auth/fetcher.server";

type SessionUser = Pick<User, "id" | "name" | "image">;

export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  try {
    const { data } = await serverFetch<User>({
      method: "GET",
      url: "/users/me",
    });
    return {
      id: data.id,
      name: data.name,
      image: data.image ?? null,
    };
  } catch {
    return null;
  }
});
