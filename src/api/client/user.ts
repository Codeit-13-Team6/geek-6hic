import axiosInstance from "@/lib/clientFetcher";
import { User, UserProfileUpdateProps } from "@/types";

export async function getUser(): Promise<User> {
  const { data } = await axiosInstance.get("/users/me");
  return data;
}

export async function updateUserProfile(
  profileForm: UserProfileUpdateProps,
): Promise<User> {
  const { data } = await axiosInstance.patch("/users/me", profileForm);
  return data;
}
