import axios from "axios";
import axiosInstance from "@/lib/auth/fetcher.client";
import { User, UserProfileUpdateProps, UploadImageResponse } from "@/types";

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

// 프로필 이미지를 S3에 업로드 후 publicUrl 반환
export async function uploadProfileImage(file: File): Promise<string> {
  const fileName = file.name;
  const contentType = file.type || "image/jpeg";

  const issueResponse = await axiosInstance.post<UploadImageResponse>(
    "/images",
    {
      fileName,
      contentType,
      folder: "users",
    },
  );

  await axios.put(issueResponse.data.presignedUrl, file, {
    headers: {
      "Content-Type": contentType,
    },
  });

  return issueResponse.data.publicUrl;
}
