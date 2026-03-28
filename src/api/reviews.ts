import axiosInstance from "@/lib/clientFetcher";

export async function getReviews(params: {}): Promise<void[]> {
  const { data } = await axiosInstance.get("/reviews", { params });
  return data;
}
