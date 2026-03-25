export interface Meeting {
  id: number;
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
  image: string;
  description: string;
}

export interface GetMeetingListParams {
  type?: string;
  // region?: string;
  // date?: string;
  sortBy?: 'createdAt' | 'dateTime' | 'registrationEnd' | 'participantCount';
  sortOrder?: 'asc' | 'desc'; // 오름차순 내림차순
  cursor?: string;
  size?: number;
}
//내가 참여한 모임에 대한 추가 정보
export interface JoinedMeeting extends Meeting {
  isFavorited: boolean;
  joinedAt: string;
  isCompleted: boolean;
}

export interface JoinedMeetingsResponse {
  data: JoinedMeeting[];
  nextCursor: string | null;
  hasMore: boolean;
}
