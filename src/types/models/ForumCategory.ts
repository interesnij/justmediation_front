import { Post } from "./Post";

/** ForumCategory */
export interface ForumCategory {
  /** Forum category id. */
  id: number;

  /** Title. */
  title: string;

  /** Icon url. */
  icon: string;

  /** Description. */
  description: string;

  /** Number of topics in category. */
  topicCount: number;

  /** Number of posts in category. */
  postCount: number;

  /** Last post in category. */
  lastPost: Post;

  /** Date of creation. */
  created: string;

  /** Date of modification. */
  modified: string;
}
