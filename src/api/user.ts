import axiosInstance from "@/lib/axios";
import { User } from "@/types";

export async function getUser(): Promise<User> {
  const { data } = await axiosInstance.get("/users/me");
  return data;
}
