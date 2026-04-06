import { serverAxios } from "@/lib/serverFetcher";
import type { User } from "@/types";

export async function getPublicUserProfile({
  teamId,
  userId,
}: {
  teamId: string;
  userId: number;
}) {
  const response = await serverAxios.get<User>(`/users/${userId}`);
  return response.data;
}
