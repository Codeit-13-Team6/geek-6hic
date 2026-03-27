import axiosInstance from "@/lib/client-fetcher";
import axios from "axios";
import { UploadImageResponse } from "@/app/meetings/modal/modal";

export async function uploadMeetingImage(file: File) {
  const fileName = file.name;
  const contentType = file.type || "image/jpeg";

  const issueResponse = await axiosInstance.post<UploadImageResponse>(
    "/images",
    {
      fileName,
      contentType,
      folder: "meetings",
    },
  );

  await axiosInstance.put(issueResponse.data.presignedUrl, file, {
    headers: {
      "Content-Type": contentType,
    },
  });

  return issueResponse.data.publicUrl;
}
