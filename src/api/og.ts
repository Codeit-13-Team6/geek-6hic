import axios from "axios";

export const getOgData = async (url: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const baseUrl = new URL(apiUrl).origin;
  const response = await axios.get(
    `${baseUrl}/og?url=${encodeURIComponent(url)}`,
  );
  return response.data;
};
