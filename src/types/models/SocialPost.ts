import { SocialPostAuthor } from "./SocialPostAuthor";

/**
 * Model of social post.
 */
export interface SocialPost {
  /** ID. */
  id: number;
  /** Author ID. */
  author: number;
  /** Author information. */
  authorData: SocialPostAuthor;
  /** Title. */
  title: string;
  /** Image. */
  image: string;
  /** Body. */
  body: string;
  /** Preview. */
  preview: string;
  /** Image thumbnail. */
  imageThumbnail: string;
  /** Creation date. */
  created: Date;
  /** Date of the last modification */
  modified: Date;
}
