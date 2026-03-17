import axiosInstance from "@/lib/axios";
import { Meeting } from "@/types/meeting";

export async function getMeetings(): Promise<Meeting[]> {
  const { data } = await axiosInstance.get("/meetings");
  return data;
}

export async function getMeeting(): Promise<{ data: Meeting[] }> {
  const { data } = await axiosInstance.get("/meetings/my");
  return data;
}

export async function createMeeting(meeting: Meeting): Promise<Meeting> {
  const { data } = await axiosInstance.post("/meetings", meeting);
  return data;
}

export async function updateFavorites(meetingId: number): Promise<void> {
  await axiosInstance.post(`/meetings/${meetingId}/favorites`);
}

export async function getFavorites(): Promise<{ data: any[] }> {
  const { data } = await axiosInstance.get("/favorites");
  return data;
}

export async function postMeetType(): Promise<void> {
  await axiosInstance.post("/meeting-types", {
    name: "스터디",
    description: "스터디 모임입니다.",
  });
}
