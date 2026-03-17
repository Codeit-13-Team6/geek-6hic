import axiosInstance from "@/lib/axios";
import { Posts } from "@/types";

export async function getPosts(): Promise<Posts[]> {
  const { data } = await axiosInstance.get("/posts");
  return data.data;
}
