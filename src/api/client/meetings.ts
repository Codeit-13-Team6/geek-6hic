import axiosInstance from "@/lib/clientFetcher";
import {
  JoinedMeetingsResponse,
  Meeting,
  GetMeetingListParams,
  CreateMeeting,
  MeetingResponse,
  MyMeetingsResponse,
  FavoritesResponse,
  MeetingType,
  GetMeetingsResponse,
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
  cursor?: string;
  size?: number;
}): Promise<MyMeetingsResponse> {
  const { data } = await axiosInstance.get("/meetings/my", { params });
  return data;
}

export async function getUserMeetings(params: {
  userId: number;
  cursor?: string;
  size?: number;
}): Promise<MyMeetingsResponse> {
  const { userId, cursor, size = 10 } = params;
  const collected: MyMeetingsResponse["data"] = [];
  let nextCursor = cursor;
  let hasMore = true;

  while (hasMore && collected.length < size) {
    const { data } = await axiosInstance.get<GetMeetingsResponse>("/meetings", {
      params: {
        sortBy: "dateTime",
        sortOrder: "desc",
        size: 50,
        ...(nextCursor ? { cursor: nextCursor } : {}),
      },
    });

    collected.push(
      ...data.data.filter(
        (meeting: MeetingResponse) =>
          meeting.hostId === userId ||
          meeting.host?.id === userId ||
          meeting.createdBy === userId,
      ),
    );
    if (data.hasMore && !data.nextCursor) {
      hasMore = false;
      nextCursor = undefined;
      break;
    }

    hasMore = data.hasMore;
    nextCursor = data.nextCursor ?? undefined;
  }

  return {
    data: collected,
    hasMore,
    nextCursor: nextCursor ?? null,
  };
}

export async function getJoinedMeetings(params: {
  cursor?: string;
  size?: number;
  sortOrder?: string;
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
  cursor?: string;
  size?: number;
}): Promise<FavoritesResponse> {
  const { data } = await axiosInstance.get("/favorites", { params });
  return data;
}
