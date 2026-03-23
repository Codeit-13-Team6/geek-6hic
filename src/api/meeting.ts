import axiosInstance from "@/lib/axios";
import { Meeting } from "@/types";
import axios from "axios";

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
