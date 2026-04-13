import type { CursorResponse, OffsetResponse } from "./pagination";
import { Dispatch, SetStateAction } from "react";

export interface MeetingMember {
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

export interface MeetingAttendanceComment {
  id: number;
  authorId: number;
  content: string;
  createdAt: string;
}

export interface MeetingType {
  id: number;
  teamId: string;
  name: string;
  description: string;
  createdAt: string;
}

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

export interface Meeting extends CreateMeeting {
  id: number;
  participantCount: number;
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

export interface MeetingResponse extends Meeting {
  teamId: string;
  canceledAt: string | null;
  confirmedAt: string | null;
  hostId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  host: MeetingMember;
  isFavorited: boolean;
}

export interface MeetingDetailApiData extends MeetingResponse {
  isCompleted: boolean;
  isJoined: boolean;
}

export interface MeetingDetailData extends MeetingResponse {
  link: string;
  isHost: boolean;
  isJoined: boolean;
  isLoggedIn: boolean;
  threads: MeetingThreadItem[];
}

//내가 참여한 모임에 대한 추가 정보
export interface JoinedMeeting extends Meeting {
  isFavorited: boolean;
  joinedAt: string;
  isJoined: boolean;
  isCompleted: boolean;
  createdAt: string;
  hostId?: number;
}

export interface FavoritesResponseData {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  createdAt?: string;
  meeting: MeetingDetailApiData;
}

export interface MeetingParticipant {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  joinedAt: string;
  user: MeetingMember;
}

export type JoinedMeetingsResponse = CursorResponse<JoinedMeeting>;
export type FavoritesPageResponse = OffsetResponse<FavoritesResponseData>;
export type MyMeetingsPageResponse = OffsetResponse<MeetingResponse>;
export type MeetingParticipantsResponse = CursorResponse<MeetingParticipant>;
export type MeetingAttendanceCommentsResponse =
  CursorResponse<MeetingAttendanceComment>;
export type GetMeetingsResponse = CursorResponse<MeetingResponse>;

export interface MeetingsRecommendResponse {
  data: RecommendedMeetingItem[];
}

export interface MeetingJoinResponse {
  message: string;
}

export interface MeetingActionErrorResponse {
  code: string;
  message: string;
}

export interface GetMeetingListParams {
  type?: string;
  keyword?: string;
  sortBy?: MeetingSortBy;
  sortOrder?: SortOrder;
  cursor?: string;
  size?: number;
}


export type MeetingSortBy =
  | "createdAt"
  | "dateTime"
  | "registrationEnd"
  | "participantCount";

export type SortOrder = "asc" | "desc";

export interface MeetingListProps {
  meetingList: JoinedMeeting[];
  sortValue?: MeetingSortBy;
  onItemClick: (item: JoinedMeeting) => void;
  onHeartClick: (item: JoinedMeeting) => void;
  meetingStatusBadgeVisible?: boolean;
}

export interface UserCardProps {
  title?: string;
  type?: string;
  date?: Date;
  imageSrc?: string;
  participantCount?: number;
  createdAt?: string;
  capacity?: number;
  defaultLiked?: boolean;
  showLikeBtn?: boolean;
  showLockBtn?: boolean;
  onHeartClick?: (liked: boolean) => void;
  onDetailClick?: () => void;
}

export interface MeetingHeaderSectionProps {
  meetingId: number;
  detail: MeetingDetailApiData;
  participants: MeetingParticipant[];
  isHost: boolean;
  isJoined: boolean;
  isLoggedIn: boolean;
}

export interface MeetingDetailContentProps {
  meetingId: number;
}

export interface MeetingLinkSectionProps {
  link: string;
  canViewLink: boolean;
  isLoggedIn: boolean;
}

export interface MeetingThreadSectionProps {
  meetingId: number;
  canWriteThread: boolean;
  isLoggedIn: boolean;
}

export interface RecommendedMeetingsSectionProps {
  meetingId: number;
  meetingType: string;
}

export interface MeetingDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export interface EditMeetingModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  detail: MeetingDetailApiData;
  onSubmit: (nextValues: Partial<MeetingDetailData>) => Promise<void> | void;
}

// --- 모임 생성/수정 폼 ---

export interface UploadImageResponse {
  presignedUrl: string;
  publicUrl: string;
}

export interface MeetingBasicInfoValues {
  category?: string;
  name: string;
  description: string;
  link: string;
  imageFile: File | null;
  previewImageUrl: string;
  imageUrl: string | null;
  isPrivate: boolean;
}

export interface MeetingBasicInfoErrors {
  category?: string;
  name: string;
  description: string;
  link: string;
  imageUrl: string;
}

export interface MeetingScheduleStepValues {
  capacity: string;
}

export interface MeetingFormValues
  extends MeetingBasicInfoValues, MeetingScheduleStepValues {
  category: string;
}

export interface MeetingFormErrors
  extends MeetingBasicInfoErrors, MeetingScheduleStepValues {
  category: string;
}

export interface MeetingModalFormProps {
  values: MeetingBasicInfoValues & { capacity: string };
  isImageUploading: boolean;
  errors: MeetingBasicInfoErrors & { capacity: string };
  onChange: (nextValues: {
    category?: string;
    name?: string;
    description?: string;
    link?: string;
    capacity?: string;
    isPrivate?: boolean;
  }) => void;
  onChangeImage: (nextFile: File | null) => void;
  onRemoveImage: () => void;
  showCategoryField?: boolean;
}

export interface RemoveMeetingImageParams {
  previewImageUrlRef: { current: string };
  setFormValues: Dispatch<SetStateAction<MeetingFormValues>>;
  setIsImageUploading: Dispatch<SetStateAction<boolean>>;
  clearImageError: () => void;
}

export interface ChangeMeetingImageParams extends RemoveMeetingImageParams {
  nextFile: File | null;
  setImageError: (message: string) => void;
  onUploadError: () => void;
}
