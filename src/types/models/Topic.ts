import { Post } from "./Post";

/** Topic dto model. */
export interface Topic {
  /** Id. */
  id: number;
  /** Category. */
  category: number;
  /** Title. */
  title: string;
  /** First post in topic. */
  firstPost: Post;
  /** Last post in topic. */
  lastPost: Post;
  /** Number of posts. */
  postCount: number;
  /** Is user follow the topic */
  followed: number;
  /** Message on topic creation */
  message: string;
  /** Created date. */
  created: Date;
}
