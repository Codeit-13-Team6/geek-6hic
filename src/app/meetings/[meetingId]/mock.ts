import { MeetingDetailData } from "@/app/meetings/[meetingId]/types";

export const meetingDetailMock: MeetingDetailData = {
  id: 1,
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
  isHost: false,
  isJoined: false,
  isLoggedIn: true,
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
  ],
};
