import axiosInstance from "@/lib/axios";
import axios from "axios";
import { UploadImageResponse } from "@/app/meeting/modal/modal";

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

  await axios.put(issueResponse.data.presignedUrl, file, {
    headers: {
      "Content-Type": contentType,
    },
  });

  return issueResponse.data.publicUrl;
}
