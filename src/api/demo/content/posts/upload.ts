import { DEMO_FEEDS_FRIENDS } from "../../feeds/friends";
import { DEMO_PERSON_ME } from "../../person/me";
import { v4 as uuidv4 } from "uuid";

const fileToBase64URL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const DEMO_CONTENT_POSTS_UPLOAD = async (frontImage: File, backImage: File, when: Date): Promise<void> => {
  let feed = DEMO_FEEDS_FRIENDS();
  let isFirst = false;

  if (feed.userPosts === null) {
    isFirst = true;
    feed = DEMO_FEEDS_FRIENDS({
      userPosts: {
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
    });
  }

  const posts = [...feed.userPosts!.posts];
  const id = uuidv4();

  posts.push({
    id,
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
  });

  // @ts-expect-error : it's recursive...
  DEMO_FEEDS_FRIENDS({ userPosts: { posts } });
};
