import axiosInstance from "@/lib/clientFetcher";

export async function getOgData(url: string) {
  const response = await axiosInstance.get(
    `/og?url=${encodeURIComponent(url)}`,
  );
  return response.data;
};
