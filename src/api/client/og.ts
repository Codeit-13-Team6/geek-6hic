import axiosInstance from "@/lib/auth/fetcher.client";

export async function getOgData(url: string) {
  const response = await axiosInstance.get(
    `/og?url=${encodeURIComponent(url)}`,
  );
  return response.data;
};
