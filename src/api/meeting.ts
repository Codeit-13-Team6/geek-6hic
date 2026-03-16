import { Meeting } from "@/types/meeting";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getMeetings(token: string): Promise<Meeting[]> {
  const res = await fetch(`${BASE_URL}/meetings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("모임 목록 조회 실패");
  return res.json();
}

export async function getMeeting( token: string): Promise<Meeting> {
  const res = await fetch(`${BASE_URL}/meetings/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("모임 조회 실패");
  return res.json();
}

export async function createMeeting(data: Meeting, token: string): Promise<Meeting> {
  const res = await fetch(`${BASE_URL}/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(JSON.stringify(err));
  }
  return res.json();
}

export async function updateFavorites( meetingId: number, token: string): Promise<Meeting> {
  const res = await fetch(`${BASE_URL}/meetings/${meetingId}/favorites`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(JSON.stringify(err));
  }
  return res.json();
}



export async function getFavorites(
  token: string,
): Promise<Meeting> {
  const res = await fetch(`${BASE_URL}/favorites`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(JSON.stringify(err));
  }
  return res.json();
}



export async function postMeetType(token: string): Promise<Meeting> {
  const res = await fetch(`${BASE_URL}/meeting-types`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: '스터디',
      description: '스터디 모임입니다.'
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(JSON.stringify(err));
  }
  return res.json();
}



