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