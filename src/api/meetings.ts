import axiosInstance from "@/lib/client-fetcher";
import {
  JoinedMeetingsResponse,
  Meeting,
  GetMeetingListParams,
  CreateMeeting,
  UpdateMeeting,
  MyMeetingsResponse,
  FavoritesResponse,
} from "@/types";
import type { MeetingParticipantsResponse } from "@/types/meetingTypes";

export async function getMeetingList(
  params: GetMeetingListParams,
): Promise<JoinedMeetingsResponse> {
  const res = await axiosInstance.get<JoinedMeetingsResponse>("/meetings", {
    params,
  });

  return res.data;
}

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
