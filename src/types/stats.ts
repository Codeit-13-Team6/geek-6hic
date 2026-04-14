export interface ParticipantStats {
  team: number;
  study: number;
  project: number;
  jobPrep: number;
  etc: number;
}

export interface BasicProfileStats {
  postCount: number;
  meetingCount: number;
  favoriteCount: number;
}

export interface CreatedMeetingSummary {
  category: "PROJECT" | "STUDY";
}
