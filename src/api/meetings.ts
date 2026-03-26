import axiosInstance from "@/lib/client-fetcher";
import {
  JoinedMeeting,
  JoinedMeetingsResponse,
  Meeting,
  GetMeetingListParams,
  FavoritesResponse,
  MyMeetingsResponse,
} from "@/types";

export async function getMeetingList(
  params: GetMeetingListParams,
): Promise<JoinedMeeting[]> {
  const response = await axiosInstance.get("/meetings", { params });

  return response.data.data;
}

// export async function getMeetings(params: {}): Promise<Meeting[]> {
//   const { data } = await axiosInstance.get("/meetings", { params });
//   return data;
// }

export async function getMeeting(params?: {
  cursor?: string;
  size?: number;
}): Promise<MyMeetingsResponse> {
  const { data } = await axiosInstance.get("/meetings/my", { params });
  return data;
}

export async function getJoinedMeetings(params: {
  cursor?: string;
  size?: number;
}): Promise<JoinedMeetingsResponse> {
  const { data } = await axiosInstance.get("/meetings/joined", {
    params,
  });
  return data;
}

export async function createMeeting(meeting: Meeting): Promise<Meeting> {
  const { data } = await axiosInstance.post("/meetings", meeting);
  return data.data;
}

export async function updateFavorites(meetingId: number): Promise<void> {
  await axiosInstance.post(`/meetings/${meetingId}/favorites`);
}

export async function deleteFavorites(meetingId: number): Promise<void> {
  await axiosInstance.delete(`/meetings/${meetingId}/favorites`);
}

export async function getFavorites(params?: {
  cursor?: string;
  size?: number;
}): Promise<FavoritesResponse> {
  const { data } = await axiosInstance.get("/favorites", { params });
  return data;
}

export async function postMeetType(): Promise<void> {
  await axiosInstance.post("/meeting-types", {
    name: "스터디",
    description: "스터디 모임입니다.",
  });
}
