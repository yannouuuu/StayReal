import { FeedsFriends } from "~/api/requests/feeds/friends";
import { deepMerge } from "~/utils/deep-merge";

let data = {
  eventProtoBytes: [],
  maxPostsPerMoment: 1,
  friendsPosts: [],
  remainingPosts: 0,
  userPosts: null
} satisfies FeedsFriends;

export const DEMO_FEEDS_FRIENDS = (migration?: Partial<FeedsFriends>): FeedsFriends => {
  if (migration) {
    data = deepMerge(data, migration);
  }

  return data;
};
