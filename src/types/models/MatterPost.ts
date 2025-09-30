import { Author } from "./Author";

/** Matter post model. */
export interface MatterPost {
  /** Identifier */
  id: number;
  /** Topic identifier */
  topic: number;
  /** Author as attorney or client */
  author: Author;
  /** Text */
  text: string;
  /** Created at */
  created: Date;
  /** Modified at */
  modified: Date;
  /** Is the post belongs to the current user. */
  isMyPost: boolean;
}
