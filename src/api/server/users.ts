import { serverAxios } from "@/lib/serverFetcher";
import type { User } from "@/types";

export async function getPublicUserProfile({ userId }: { userId: number }) {
  const response = await serverAxios.get<User>(`/users/${userId}`);
  return response.data;
}
