import type { RelationshipsFriends } from "~/api/requests/relationships/friends/list";

export const DEMO_RELATIONSHIPS_FRIENDS_LIST = {
  data: [
    {
      id: "alice-123456",
      username: "alice",
      fullname: "Alice",
      status: "accepted"
    },
    {
      id: "mike-123456",
      username: "mike",
      fullname: "Mike",
      status: "accepted"
    },
  ],
  next: null,
  total: 1
} satisfies RelationshipsFriends;
