import type { DateRange } from "react-day-picker";

export interface CreateMeeting {
  name: string;
  type: string;
  region: string;
  address: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  registrationEnd: string;
  capacity: number;
  image: string | null;
  description: string;
}

export type UpdateMeeting = Partial<CreateMeeting>;

export type Meeting = CreateMeeting & {
  id: number;
  participantCount: number;
};

export interface GetMeetingListParams {
  type?: string;
  // region?: string;
  // date?: string;
  sortBy?: "createdAt" | "dateTime" | "registrationEnd" | "participantCount";
  sortOrder?: "asc" | "desc"; // 오름차순 내림차순
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

export interface FavoritesResponse {
  data: any[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface MyMeetingsResponse {
  data: Meeting[];
  nextCursor: string | null;
  hasMore: boolean;
}


export type TabValue = "all" | "team" | "study" | "job" | "wework" | "etc";

export type SortValue = "deadline" | "participants" | null;

export interface MeetingFiltersProps {
  activeValue: TabValue;
  sortValue: SortValue;
  appliedDate: DateRange | undefined;
  onChangeTab: (value: TabValue) => void;
  onChangeSort: (value: SortValue) => void;
  onApplyDate: (value: DateRange | undefined) => void;
  onResetFilters: () => void;
}


export interface MeetingListProps {
  meetingList: JoinedMeeting[];
  isLoading: boolean;
  sortValue?: "deadline" | "participants" | null;
  onItemClick: (item: JoinedMeeting) => void;
  onHeartClick: (item: JoinedMeeting) => void;
}