import axiosInstance from "@/lib/client-fetcher";

export const getOgData = async (url: string) => {
  const response = await axiosInstance.get(
    `/og?url=${encodeURIComponent(url)}`,
  );
  return response.data;
};
