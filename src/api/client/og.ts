import axiosInstance from "@/lib/auth/clientFetcher";

export async function getOgData(url: string) {
  const response = await axiosInstance.get(
    `/og?url=${encodeURIComponent(url)}`,
  );
  return response.data;
};
