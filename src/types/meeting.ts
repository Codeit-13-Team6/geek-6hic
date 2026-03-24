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
  sortBy?: 'dateTime' | 'registrationEnd' | 'participantCount';
}

export interface GetMeetingListParams {
  type?: string;
  region?: string;
  date?: string;
  sortBy?: 'dateTime' | 'registrationEnd' | 'participantCount';
}