import axiosInstance from "@/lib/auth/clientFetcher";
import {
  JoinedMeetingsResponse,
  Meeting,
  GetMeetingListParams,
  CreateMeeting,
  FavoritesPageResponse,
  MeetingType,
  MyMeetingsPageResponse,
} from "@/types";

export async function getMeetingList(
  params: GetMeetingListParams,
): Promise<JoinedMeetingsResponse> {
  const res = await axiosInstance.get<JoinedMeetingsResponse>("/meetings", {
    params,
  });

  return res.data;
}

export async function getMeetingTypes(): Promise<MeetingType[]> {
  const { data } = await axiosInstance.get<MeetingType[]>("/meeting-types");
  return data;
}

export async function getMeeting(params?: {
  offset?: number;
  limit?: number;
  cursor?: string;
  size?: number;
}): Promise<MyMeetingsPageResponse> {
  const { data } = await axiosInstance.get<MyMeetingsPageResponse>(
    "/meetings/my",
    { params },
  );
  return data;
}

export async function getUserMeetingsPage(params: {
  userId: number;
  offset?: number;
  limit?: number;
}): Promise<MyMeetingsPageResponse> {
  const { data } = await axiosInstance.get<MyMeetingsPageResponse>(
    `/users/${params.userId}/meetings-visible`,
    {
      params: {
        offset: params.offset ?? 0,
        limit: params.limit ?? 10,
      },
    },
  );

  return data;
}

export async function getJoinedMeetings(params: {
  cursor?: string;
  size?: number;
  sortOrder?: string;
  sortBy?: string;
  completed?: boolean;
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
  params: Partial<CreateMeeting>,
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
  offset?: number;
  limit?: number;
  cursor?: string;
  size?: number;
}): Promise<FavoritesPageResponse> {
  const { data } = await axiosInstance.get<FavoritesPageResponse>(
    "/favorites",
    {
      params: { ...params, sortBy: "meetingCreatedAt", sortOrder: "desc" },
    },
  );

  return data;
}
