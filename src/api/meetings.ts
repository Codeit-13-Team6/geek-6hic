import axiosInstance from "@/lib/client-fetcher";
import { Meeting } from "@/types";
import axios from "axios";

// 모임리스트 타입정의
export interface GetMeetingListParams {
  type?: string;
  region?: string;
  date?: string;
  sortBy?: 'dateTime' | 'registrationEnd' | 'participantCount';
  sortOrder?: 'asc' | 'desc';
  cursor?: string;
  size?: number;
}

export async function getMeetingList(
  params?: GetMeetingListParams
) {
  const { data } = await axiosInstance.get('/meetings', {
    params,
  });

  return data.data;
}

export async function getMeetings(params: {}): Promise<Meeting[]> {
  const { data } = await axiosInstance.get("/meetings", { params });
  return data;
}

// 이름 수정 필요
export async function getMeeting(): Promise<Meeting[]> {
  const { data } = await axiosInstance.get("/meetings/my");
  return data.data;
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
