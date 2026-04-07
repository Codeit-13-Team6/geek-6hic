import type { DateRange } from "react-day-picker";
import type { StaticImageData } from "next/image";
import type { CursorResponse } from "./pagination";
import { Dispatch, SetStateAction } from "react";
import { LucideIcon, LucideProps } from "lucide-react";

export interface MeetingMember {
  id: number;
  name: string;
  image: string | null;
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

export interface MeetingResponseBase {
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
  host: MeetingMember;
  isFavorited: boolean;
}

export type MeetingListItemApiData = MeetingResponseBase;

export interface MeetingDetailApiData extends MeetingResponseBase {
  isCompleted: boolean;
  isJoined: boolean;
}

export interface MeetingDetailData extends MeetingResponseBase {
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
}

export interface FavoritesResponseData {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  createdAt: string;
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

export interface MeetingAttendanceComment {
  id: number;
  authorId: number;
  content: string;
  createdAt: string;
}

export type JoinedMeetingsResponse = CursorResponse<JoinedMeeting>;
export type FavoritesResponse = CursorResponse<FavoritesResponseData>;
export type MyMeetingsResponse = CursorResponse<Meeting>;
export type MeetingParticipantsResponse = CursorResponse<MeetingParticipant>;
export type MeetingAttendanceCommentsResponse =
  CursorResponse<MeetingAttendanceComment>;
export type MeetingListResponse = CursorResponse<MeetingResponseBase>;

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
  // region?: string;
  // date?: string;
  sortBy?: "createdAt" | "dateTime" | "registrationEnd" | "participantCount";
  sortOrder?: "asc" | "desc"; // 오름차순 내림차순
  cursor?: string;
  size?: number;
}

export type TabValue = string;

export interface MeetingType {
  id: number;
  teamId: string;
  name: string;
  description: string;
  createdAt: string;
}

export type SortValue =
  | ""
  | "dateTime"
  | "registrationEnd"
  | "participantCount"; // 모임일시 , 모집 마감일 , 참가자수
export type SortBy = SortValue;

export interface MeetingFiltersProps {
  // tabList?: { value: string; label: string }[];
  activeValue: TabValue;
  sortValue: SortValue;
  sortDescValue: boolean;
  appliedDate: DateRange | undefined;
  onChangeTab: (value: TabValue) => void;
  onChangeSort: (value: SortValue) => void;
  onApplyDate: (value: DateRange | undefined) => void;
  onResetFilters: () => void;
  onChangeSortDesc: (value: boolean) => void;
}

export interface MeetingListProps {
  meetingList: JoinedMeeting[];
  isLoading: boolean;
  sortValue?: SortValue;
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
  capacity?: number;
  defaultLiked?: boolean;
  showLikeBtn?: boolean;
  onHeartClick?: (liked: boolean) => void;
  onDetailClick?: () => void;
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

export interface MeetingHeaderSectionProps {
  meetingId: number;
  detail: MeetingDetailApiData;
  participants: MeetingParticipant[];
  isHost: boolean;
  isJoined: boolean;
  isLoggedIn: boolean;
}

export type MeetingActionState =
  | "guest_join"
  | "joinable"
  | "attendance_ready"
  | "attendance_done";

export interface MeetingDetailContentProps {
  meetingId: number;
}

export interface MeetingDescriptionSectionProps {
  data: MeetingDetailData;
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

export interface MeetingCategoryItem {
  value: string;
  label: string;
  imageSrc?: StaticImageData;
  className?: string;
  icon?: LucideIcon | React.ComponentType<LucideProps>;
}

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

export interface MeetingBasicInfoSectionProps {
  values: MeetingBasicInfoValues & { capacity: string };
  isImageUploading: boolean;
  errors: MeetingBasicInfoErrors & { capacity: string };
  onChange: (nextValues: {
    category?: string;
    name?: string;
    description?: string;
    link?: string;
    capacity?: string;
  }) => void;
  onChangeImage: (nextFile: File | null) => void;
  onRemoveImage: () => void;
  showCategoryField?: boolean;
}

export interface MeetingCategoryStepProps {
  value: string;
  onChange: (value: string) => void;
}

