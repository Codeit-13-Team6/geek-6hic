import axiosInstance from "@/lib/clientFetcher";
import { createComment } from "@/api/comments";
import {
  MeetingDetailApiData,
  MeetingDetailData,
  MeetingJoinResponse,
  MeetingListResponse,
  MeetingParticipantsResponse,
} from "@/types";
import { UploadImageResponse } from "@/types";

const PARTICIPANTS_PAGE_SIZE = 100;
const RECOMMENDED_MEETINGS_PAGE_SIZE = 100;

export const getAttendancePostId = (region: string) => {
  const postId = Number(region);

  return Number.isFinite(postId) && postId > 0 ? postId : null;
};

export async function getMeetingDetail(meetingId: number) {
  const { data } = await axiosInstance.get<MeetingDetailApiData>(
    `/meetings/${meetingId}`,
  );

  return data;
}

export async function getMeetingParticipants(meetingId: number) {
  const { data } = await axiosInstance.get<MeetingParticipantsResponse>(
    `/meetings/${meetingId}/participants`,
    {
      params: {
        size: PARTICIPANTS_PAGE_SIZE,
      },
    },
  );

  return data;
}

export async function getMeetingRecommendationCandidates() {
  const { data } = await axiosInstance.get<MeetingListResponse>("/meetings", {
    params: {
      sortBy: "dateTime",
      sortOrder: "asc",
      size: RECOMMENDED_MEETINGS_PAGE_SIZE,
    },
  });

  return data;
}

export async function joinMeeting(meetingId: number) {
  const { data } = await axiosInstance.post<MeetingJoinResponse>(
    `/meetings/${meetingId}/join`,
  );

  return data;
}

export async function cancelMeetingJoin(meetingId: number) {
  const { data } = await axiosInstance.delete<MeetingJoinResponse>(
    `/meetings/${meetingId}/join`,
  );

  return data;
}

export async function addMeetingFavorite(meetingId: number) {
  await axiosInstance.post(`/meetings/${meetingId}/favorites`);
}

export async function removeMeetingFavorite(meetingId: number) {
  await axiosInstance.delete(`/meetings/${meetingId}/favorites`);
}

export async function updateMeeting(
  meetingId: number,
  nextValues: Partial<MeetingDetailData>,
) {
  const { data } = await axiosInstance.patch<MeetingDetailApiData>(
    `/meetings/${meetingId}`,
    {
      name: nextValues.name,
      type: nextValues.type,
      region: nextValues.region,
      address: nextValues.link ?? nextValues.address,
      latitude: nextValues.latitude ?? 0,
      longitude: nextValues.longitude ?? 0,
      dateTime: nextValues.dateTime,
      registrationEnd: nextValues.registrationEnd,
      capacity: nextValues.capacity,
      image: nextValues.image,
      description: nextValues.description,
    },
  );

  return data;
}

export async function deleteMeeting(meetingId: number) {
  await axiosInstance.delete(`/meetings/${meetingId}`);
}

export async function attendMeeting(region: string) {
  const postId = getAttendancePostId(region);

  if (!postId) {
    throw new Error("INVALID_ATTENDANCE_POST_ID");
  }

  await createComment(
    postId,
    `onlyScore_${region}_${Math.floor(Math.random() * 5) + 1}`,
  );
}

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
