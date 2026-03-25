import { MeetingDetailData } from "@/app/meetings/[meetingId]/types";

const meetingBaseMock: Omit<
  MeetingDetailData,
  "id" | "isHost" | "isJoined" | "isLoggedIn"
> = {
  teamId: "dallaem",
  name: "작은 독서 습관 만들기",
  type: "스터디",
  region: "강남구",
  address: "서울 강남구 테헤란로 123",
  link: "https://open.kakao.com/o/example-room",
  latitude: 37.5407,
  longitude: 127.0693,
  dateTime: "2026-03-28T19:00:00.000Z",
  registrationEnd: "2026-03-28T19:00:00.000Z",
  capacity: 20,
  participantCount: 16,
  image:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  description:
    "작은 독서 습관 만들기 모임입니다. 매주 한 권씩 가볍게 읽은 책을 공유하고, 다음 주까지의 작은 목표를 함께 정해보려 합니다.",
  canceledAt: null,
  confirmedAt: null,
  hostId: 1,
  createdBy: 1,
  createdAt: "2026-03-20T10:00:00.000Z",
  updatedAt: "2026-03-20T10:00:00.000Z",
  host: {
    id: 1,
    name: "상현",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  isFavorited: false,
  threads: [
    {
      id: 1,
      author: "유리",
      createdAt: "2026-03-20T10:00:00.000Z",
      content:
        "책이 정해져 있지 않아도 괜찮을 것 같아요. 가볍게 인상 깊었던 문장만 가져와도 충분할 듯합니다.",
    },
    {
      id: 2,
      author: "안녕독서",
      createdAt: "2026-03-20T11:30:00.000Z",
      content:
        "출근 전에 읽는 습관을 붙이고 싶어서 참여해봅니다. 혹시 분량은 자유롭게 가져가도 될까요?",
    },
    {
      id: 3,
      author: "박지윤",
      createdAt: "2026-03-20T12:20:00.000Z",
      content:
        "완독이 목표가 아니라 루틴 만들기가 목표인 분위기라 편하게 참여해도 좋을 것 같습니다.",
    },
    {
      id: 4,
      author: "기록생활자",
      createdAt: "2026-03-20T13:40:00.000Z",
      content:
        "읽은 내용만 짧게라도 기록하는 시간이 있으면 좋겠어요. 템플릿이 있으면 더 좋을 듯합니다.",
    },
  ],
  recommendedMeetings: [
    {
      id: 11,
      name: "하루 10분 독서 루틴",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
      participantCount: 8,
      capacity: 20,
      registrationEnd: "2026-03-27T17:30:00.000Z",
      dateTime: "2026-03-28T17:30:00.000Z",
    },
    {
      id: 12,
      name: "카페 투어 겸 책 리뷰",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      participantCount: 12,
      capacity: 20,
      registrationEnd: "2026-03-27T19:00:00.000Z",
      dateTime: "2026-03-28T19:00:00.000Z",
    },
    {
      id: 13,
      name: "퇴근 후 책으로 이야기하기",
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      participantCount: 7,
      capacity: 20,
      registrationEnd: "2026-03-28T17:30:00.000Z",
      dateTime: "2026-03-28T20:30:00.000Z",
    },
    {
      id: 14,
      name: "영화로 만나는 문학 모임",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      participantCount: 10,
      capacity: 20,
      registrationEnd: "2026-03-28T17:30:00.000Z",
      dateTime: "2026-03-28T17:30:00.000Z",
    },
  ],
};

export const meetingDetailMocks: Record<number, MeetingDetailData> = {
  1: {
    ...meetingBaseMock,
    id: 1,
    isHost: false,
    isJoined: false,
    isLoggedIn: false,
  },
  2: {
    ...meetingBaseMock,
    id: 2,
    isHost: false,
    isJoined: false,
    isLoggedIn: true,
  },
  3: {
    ...meetingBaseMock,
    id: 3,
    isHost: false,
    isJoined: true,
    isLoggedIn: true,
    isFavorited: true,
  },
  4: {
    ...meetingBaseMock,
    id: 4,
    isHost: true,
    isJoined: false,
    isLoggedIn: true,
  },
  5: {
    ...meetingBaseMock,
    id: 5,
    isHost: false,
    isJoined: false,
    isLoggedIn: true,
    registrationEnd: "2026-03-20T09:00:00.000Z",
  },
  6: {
    ...meetingBaseMock,
    id: 6,
    isHost: false,
    isJoined: true,
    isLoggedIn: true,
    registrationEnd: "2026-03-20T09:00:00.000Z",
  },
  7: {
    ...meetingBaseMock,
    id: 7,
    isHost: false,
    isJoined: true,
    isLoggedIn: true,
    dateTime: "2026-03-20T10:00:00.000Z",
    registrationEnd: "2026-03-20T08:00:00.000Z",
  },
  8: {
    ...meetingBaseMock,
    id: 8,
    isHost: true,
    isJoined: false,
    isLoggedIn: true,
    dateTime: "2026-03-20T10:00:00.000Z",
    registrationEnd: "2026-03-20T08:00:00.000Z",
  },
};

export const meetingDetailMock = meetingDetailMocks[1];
