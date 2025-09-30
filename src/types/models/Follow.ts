import { Topic } from "./Topic";

/** Model for Follow data */
export interface Follow {
  /** Id of the follow instance */
  id: number;
  /** Followed topic data */
  topic: Topic;
  /** Number of unread posts */
  unreadPostCount: number;
  /** Id of the last read post */
  lastReadPost: number;
}
