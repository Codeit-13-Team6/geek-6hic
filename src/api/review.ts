import { Meeting } from "@/types";
import axiosInstance from "@/lib/client-fetcher";

export async function getReview(params: {}): Promise<any[]> {
  const { data } = await axiosInstance.get("/reviews", { params });
  return data;
}
