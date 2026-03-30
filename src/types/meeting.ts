import type { DateRange } from "react-day-picker";
import type { StaticImageData } from "next/image";
import type { CursorResponse } from "./pagination";
import { Dispatch, SetStateAction } from "react";


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
  recommendedMeetings: RecommendedMeetingItem[];
}


//내가 참여한 모임에 대한 추가 정보
export interface JoinedMeeting extends Meeting {
  isFavorited: boolean;
  joinedAt: string;
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
  data: MeetingDetailData;
  participantAvatars: MeetingMember[];
  isFavoritePending: boolean;
  isJoinPending: boolean;
  isAuthLoading: boolean;
  actionLabel: string;
  isActionDisabled: boolean;
  shouldShowHostMenu: boolean;
  shouldShowClosedGuide: boolean;
  onJoin: () => Promise<void> | void;
  onCancelJoin: () => Promise<void> | void;
  onAttend: () => Promise<void> | void;
  onShare: () => Promise<void> | void;
  onEdit: (nextValues: Partial<MeetingDetailData>) => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export interface MeetingDetailViewProps extends MeetingHeaderSectionProps {
  canViewLink: boolean;
  canWriteThread: boolean;
  linkGuideText: string;
  threadGuideText: string;
}

export interface MeetingDetailContentProps {
  meetingId: number;
  hasAttendedInitially: boolean;
}

export interface MeetingDescriptionSectionProps {
  data: MeetingDetailData;
}

export interface MeetingLinkSectionProps {
  link: string;
  canViewLink: boolean;
  guideText: string;
}

export interface MeetingThreadSectionProps {
  meetingId: number;
  canWriteThread: boolean;
  guideText: string;
}

export interface RecommendedMeetingsSectionProps {
  data: MeetingDetailData;
}

export interface MeetingDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export interface EditMeetingModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  data: MeetingDetailData;
  onSubmit: (nextValues: Partial<MeetingDetailData>) => Promise<void> | void;
}

// --- 모임 생성/수정 폼 ---

export interface MeetingCategoryItem {
  value: string;
  label: string;
  imageSrc: StaticImageData;
  className?: string;
}

export interface ScheduleDatePickerProps {
  id: string;
  label: string;
  value: string;
  hintText?: string;
  isRequired?: boolean;
  isDestructive?: boolean;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
}

export interface ScheduleTimePickerProps {
  id: string;
  label?: string;
  value: string;
  hintText?: string;
  isRequired?: boolean;
  isDestructive?: boolean;
  onChange: (value: string) => void;
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
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  capacity: string;
}

export interface MeetingFormValues
  extends MeetingBasicInfoValues,
    MeetingScheduleStepValues {
  category: string;
}

export interface MeetingFormErrors
  extends MeetingBasicInfoErrors,
    MeetingScheduleStepValues {
  category: string;
}

export interface MeetingBasicInfoStepProps {
  values: MeetingBasicInfoValues;
  isImageUploading: boolean;
  errors: MeetingBasicInfoErrors;
  onChange: (nextValues: {
    category?: string;
    name?: string;
    description?: string;
    link?: string;
  }) => void;
  onChangeImage: (nextFile: File | null) => void;
  onRemoveImage: () => void;
}

export interface MeetingBasicInfoSectionProps extends MeetingBasicInfoStepProps {
  showCategoryField?: boolean;
  showImageMeta?: boolean;
}

export interface MeetingCategoryStepProps {
  value: string;
  onChange: (value: string) => void;
}

export interface MeetingScheduleStepProps {
  values: MeetingScheduleStepValues;
  errors: MeetingScheduleStepValues;
  onChange: (nextValues: Partial<MeetingScheduleStepValues>) => void;
}
