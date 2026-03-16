import { User } from "@/types/user";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export async function getUser(token: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("유저 조회 실패");
  return res.json();
}





