export interface MeetingDetailHost {
  id: number;
  name: string;
  image: string;
}

export interface MeetingThreadItem {
  id: number;
  author: string;
  createdAt: string;
  content: string;
}

export interface RecommendedMeetingItem {
  id: number;
  name: string;
  image: string;
  participantCount: number;
  capacity: number;
  registrationEnd: string;
  dateTime: string;
}

export interface MeetingDetailData {
  id: number;
  teamId: string;
  name: string;
  type: string;
  region: string;
  address: string;
  link: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  registrationEnd: string;
  capacity: number;
  participantCount: number;
  image: string;
  description: string;
  canceledAt: string | null;
  confirmedAt: string | null;
  hostId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  host: MeetingDetailHost;
  isFavorited: boolean;
  isHost: boolean;
  isJoined: boolean;
  isLoggedIn: boolean;
  threads: MeetingThreadItem[];
  recommendedMeetings: RecommendedMeetingItem[];
}
