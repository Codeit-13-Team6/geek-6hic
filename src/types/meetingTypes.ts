import type { StaticImageData } from "next/image";
import { Dispatch, SetStateAction } from "react";

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

export interface MeetingAttendanceComment {
  id: number;
  authorId: number;
  content: string;
  createdAt: string;
}

export interface MeetingAttendanceCommentsResponse {
  data: MeetingAttendanceComment[];
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

export interface ChangeMeetingImageParams {
  nextFile: File | null;
  previewImageUrlRef: { current: string };
  setFormValues: Dispatch<SetStateAction<MeetingFormValues>>;
  setIsImageUploading: Dispatch<SetStateAction<boolean>>;
  clearImageError: () => void;
  setImageError: (message: string) => void;
  onUploadError: () => void;
}

export interface RemoveMeetingImageParams {
  previewImageUrlRef: { current: string };
  setFormValues: Dispatch<SetStateAction<MeetingFormValues>>;
  setIsImageUploading: Dispatch<SetStateAction<boolean>>;
  clearImageError: () => void;
}

export interface MeetingDetailViewProps {
  data: MeetingDetailData;
  participantAvatars: MeetingParticipantUser[];
  isFavoritePending: boolean;
  isJoinPending: boolean;
  isAuthLoading: boolean;
  actionLabel: string;
  isActionDisabled: boolean;
  shouldShowHostMenu: boolean;
  shouldShowClosedGuide: boolean;
  canViewLink: boolean;
  canWriteThread: boolean;
  linkGuideText: string;
  threadGuideText: string;
  onJoin: () => Promise<void> | void;
  onCancelJoin: () => Promise<void> | void;
  onAttend: () => Promise<void> | void;
  onShare: () => Promise<void> | void;
  onEdit: (nextValues: Partial<MeetingDetailData>) => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export interface MeetingDetailContentProps {
  meetingId: number;
  hasAttendedInitially: boolean;
}
export interface MeetingDescriptionSectionProps {
  data: MeetingDetailData;
}
export interface MeetingHeaderSectionProps {
  data: MeetingDetailData;
  participantAvatars: MeetingParticipantUser[];
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
export interface MeetingTypeOption {
  value: string;
  label: string;
}

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

export interface MeetingFormValues {
  category: string;
  name: string;
  description: string;
  link: string;
  imageFile: File | null;
  previewImageUrl: string;
  imageUrl: string | null;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  capacity: string;
}

export interface MeetingFormErrors {
  category: string;
  name: string;
  description: string;
  link: string;
  imageUrl: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  capacity: string;
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
  errors: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    capacity: string;
  };
  onChange: (nextValues: Partial<MeetingScheduleStepValues>) => void;
}
