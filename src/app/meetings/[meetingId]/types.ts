export interface MeetingDetailHost {
  id: number;
  name: string;
  image: string | null;
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
  image: string | null;
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
  image: string | null;
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

export interface MeetingDetailApiData {
  id: number;
  teamId: string;
  name: string;
  type: string;
  region: string;
  address: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  registrationEnd: string;
  capacity: number;
  participantCount: number;
  image: string | null;
  description: string;
  canceledAt: string | null;
  confirmedAt: string | null;
  hostId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  host: MeetingDetailHost;
  isCompleted: boolean;
  isFavorited: boolean;
  isJoined: boolean;
}

export interface MeetingParticipantUser {
  id: number;
  name: string;
  image: string | null;
}

export interface MeetingParticipant {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  joinedAt: string;
  user: MeetingParticipantUser;
}

export interface MeetingParticipantsResponse {
  data: MeetingParticipant[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface MeetingJoinResponse {
  message: string;
}

export interface MeetingActionErrorResponse {
  code: string;
  message: string;
}

export interface MeetingListItemApiData {
  id: number;
  teamId: string;
  name: string;
  type: string;
  region: string;
  address: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  registrationEnd: string;
  capacity: number;
  participantCount: number;
  image: string | null;
  description: string;
  canceledAt: string | null;
  confirmedAt: string | null;
  hostId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  host: MeetingDetailHost;
  isFavorited: boolean;
}

export interface MeetingListResponse {
  data: MeetingListItemApiData[];
  nextCursor: string | null;
  hasMore: boolean;
}
