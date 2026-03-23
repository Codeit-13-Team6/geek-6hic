import { Meeting } from "@/types";
import axiosInstance from "@/lib/axios";

export async function getReviews(params: {}): Promise<any[]> {
  const { data } = await axiosInstance.get("/reviews", { params });
  return data;
}
