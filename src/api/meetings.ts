import axiosInstance from "@/lib/client-fetcher";
import {
  JoinedMeeting,
  JoinedMeetingsResponse,
  Meeting,
  GetMeetingListParams,
  CreateMeeting,
  UpdateMeeting,
} from "@/types";
import axios from "axios";

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

// 이름 수정 필요
export async function getMeeting(): Promise<Meeting[]> {
  const { data } = await axiosInstance.get("/meetings/my");
  return data.data;
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

export async function createMeeting(meeting: CreateMeeting): Promise<Meeting> {
  const { data } = await axiosInstance.post("/meetings", meeting);
  return data;
}

export async function updateMeeting(
  meetingId: number,
  params: UpdateMeeting,
): Promise<Meeting> {
  const { data } = await axiosInstance.patch(`/meetings/${meetingId}`, params);
  return data;
}

export async function updateFavorites(meetingId: number): Promise<void> {
  await axiosInstance.post(`/meetings/${meetingId}/favorites`);
}

export async function deleteFavorites(meetingId: number): Promise<void> {
  await axiosInstance.delete(`/meetings/${meetingId}/favorites`);
}

export async function getFavorites(): Promise<any[]> {
  const { data } = await axiosInstance.get("/favorites");
  return data.data;
}

export async function postMeetType(): Promise<void> {
  await axiosInstance.post("/meeting-types", {
    name: "스터디",
    description: "스터디 모임입니다.",
  });
}
