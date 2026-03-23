import { Meeting } from "@/types";
import axiosInstance from "@/lib/axios";

export async function getReview(params: {}): Promise<any[]> {
  const { data } = await axiosInstance.get("/reviews", { params });
  return data;
}
