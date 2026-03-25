import axios from "axios";

export const getOgData = async (url: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const response = await axios.get(
    `${baseUrl}/og?url=${encodeURIComponent(url)}`,
  );
  return response.data;
};
