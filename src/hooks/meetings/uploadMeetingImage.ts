import axiosInstance from "@/lib/client-fetcher";
import { UploadImageResponse } from "@/types/meeting/meetingTypes";

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
