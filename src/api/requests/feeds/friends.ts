import { fetch } from "@tauri-apps/plugin-http";
import auth from "../../../stores/auth"
import { BEREAL_DEFAULT_HEADERS } from "../../constants";
import { ApiMedia } from "../../types/media";

export interface FeedPost {
  id: string
  momentId: string
  primary: ApiMedia & {
    mediaType: string
    mimeType: string
  }
  secondary: ApiMedia & {
    mediaType: string
    mimeType: string
  }

  caption?: string

  location?: {
    latitude: number
    longitude: number
  }

  realMojis: Array<{
    id: string
    user: {
      id: string
      username: string
      profilePicture: ApiMedia
      type: "USER"
    }
    media: ApiMedia
    emoji: string
    type: "happy" | "up" | "heartEyes"
    isInstant: boolean
    postedAt: string
  }>

  comments: Array<{
    id: string
    user: {
      id: string
      username: string
      profilePicture: ApiMedia
      type: "USER"
    }
    content: string
    postedAt: string
  }>

  tags: Array<{
    user: {
      id: string
      username: string
      profilePicture: ApiMedia
      fullname: string
      type: "USER"
    }
    userId: string
    replaceText: string
    searchText: string
    endIndex: number
    isUntagged: boolean
    type: "tag"
  }>

  retakeCounter: number
  /** 0 : if (!self.isLate) */
  lateInSeconds: number
  isLate: boolean
  isMain: boolean
  isFirst: boolean
  isResurrected: boolean
  visibility: ("friends" | "friends-of-friends")[]
  postedAt: string
  takenAt: string
  creationDate: string
  createdAt: string
  updatedAt: string
  postType: "default"
}

export interface PostsOverview {
  user: {
    id: string
    username: string
    profilePicture: ApiMedia | null
    type: "USER"
    countryCode?: string
  }

  momentId: string
  region: string
  contentMappingEnabled: boolean

  posts: Array<FeedPost>

  moment?: {
    id: string
    region: string
  }
}

export interface FeedsFriends {
  // null if user has no posts for the on going moment
  userPosts: PostsOverview | null
  friendsPosts: Array<PostsOverview>
    
  remainingPosts: number
  maxPostsPerMoment: number
  eventProtoBytes: unknown[]
}

export const feeds_friends = async (): Promise<FeedsFriends> => {
  const response = await fetch("https://mobile.bereal.com/api/feeds/friends-v1", {
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceID),
      authorization: `Bearer ${auth.store.accessToken}`
    }
  });

  // if token expired, refresh it and retry
  if (response.status === 401) {
    await auth.refresh();
    return feeds_friends();
  }

  return response.json();
}
