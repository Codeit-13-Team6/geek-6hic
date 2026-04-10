import type { CreatedMeetingSummary } from "@/api/server";
import type { UserType } from "./gradeCharacters";

interface DeriveUserTypeParams {
  postCount: number;
  meetingCount: number;
  favoriteCount: number;
  createdMeetings: CreatedMeetingSummary[];
}

const LEADERSHIP_THRESHOLD = 0.3;
const INFLUENCE_THRESHOLD = 2.0;

export function deriveUserType({
  postCount,
  meetingCount,
  favoriteCount,
  createdMeetings,
}: DeriveUserTypeParams): UserType {
  const totalActivity = postCount + meetingCount;

  if (totalActivity === 0) {
    return "SEED";
  }

  const leadershipType =
    totalActivity < 3
      ? meetingCount > 0
        ? "L"
        : "W"
      : meetingCount / totalActivity >= LEADERSHIP_THRESHOLD
        ? "L"
        : "W";

  const { projectCount, studyCount } = createdMeetings.reduce(
    (acc, meeting) => {
      if (meeting.category === "PROJECT") {
        acc.projectCount += 1;
      }

      if (meeting.category === "STUDY") {
        acc.studyCount += 1;
      }

      return acc;
    },
    { projectCount: 0, studyCount: 0 },
  );

  const orientationType = projectCount > studyCount ? "P" : "S";

  const influenceType =
    postCount < 3
      ? favoriteCount > 0
        ? "I"
        : "A"
      : favoriteCount / postCount >= INFLUENCE_THRESHOLD
        ? "I"
        : "A";

  return `${leadershipType}${orientationType}${influenceType}` as UserType;
}
