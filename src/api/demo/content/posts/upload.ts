import { fileToBase64URL } from "~/utils/file-to-b64";
import { DEMO_FEEDS_FRIENDS as feed } from "../../feeds/friends";
import { DEMO_PERSON_ME } from "../../person/me";
import { v4 as uuidv4 } from "uuid";

export const DEMO_CONTENT_POSTS_UPLOAD = async (frontImage: File, backImage: File, when: Date): Promise<void> => {
  let isFirst = false;

  if (feed.userPosts === null) {
    isFirst = true;
    feed.userPosts = {
      contentMappingEnabled: true,
      momentId: "demo-moment-id",
      region: DEMO_PERSON_ME.region,
      posts: [],
      user: {
        profilePicture: DEMO_PERSON_ME.profilePicture,
        countryCode: DEMO_PERSON_ME.countryCode,
        username: DEMO_PERSON_ME.username,
        type: DEMO_PERSON_ME.type,
        id: DEMO_PERSON_ME.id,
      }
    }
  }

  feed.userPosts.posts = [...feed.userPosts.posts, {
    id: uuidv4(),
    isFirst,
    comments: [],
    creationDate: when.toISOString(),
    createdAt: when.toISOString(),
    updatedAt: when.toISOString(),
    takenAt: when.toISOString(),
    isLate: true,
    isMain: true,
    isResurrected: false,
    lateInSeconds: 1000,
    momentId: feed.userPosts!.momentId,
    postedAt: when.toISOString(),
    postType: "default",
    primary: {
      url: await fileToBase64URL(frontImage),
      height: 2000,
      width: 1500,
      mediaType: "image",
      mimeType: "image/webp",
    },
    secondary: {
      url: await fileToBase64URL(backImage),
      height: 2000,
      width: 1500,
      mediaType: "image",
      mimeType: "image/webp",
    },
    realMojis: [],
    retakeCounter: 0,
    tags: [],
    unblurCount: 0,
    visibility: ["friends"],
  }];
};
