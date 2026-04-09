import { getMyMeetings } from "./favorites";
import { getMyPostsServer } from "./posts";
import {
  getUserMeetingsPageServer,
  getUserPostsPageServer,
} from "./users";

export interface ProfileStats {
  postCount: number;
  meetingCount: number;
  favoriteCount: number;
}

export async function getProfileStats({
  isOwnProfile,
  userId,
}: {
  isOwnProfile: boolean;
  userId: number;
}): Promise<ProfileStats> {
  if (isOwnProfile) {
    const [meetings, posts] = await Promise.all([
      getMyMeetings({ offset: 0, limit: 1 }),
      getMyPostsServer({ offset: 0, limit: 1 }),
    ]);

    return {
      postCount: posts.totalCount,
      meetingCount: meetings.totalCount,
      favoriteCount: posts.totalLikeCount,
    };
  }

  const [meetings, posts] = await Promise.all([
    getUserMeetingsPageServer({ userId, offset: 0, limit: 1 }),
    getUserPostsPageServer({ userId, offset: 0, limit: 1 }),
  ]);

  return {
    postCount: posts.totalCount,
    meetingCount: meetings.totalCount,
    favoriteCount: posts.totalLikeCount,
  };
}
