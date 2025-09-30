import { MatterPost } from "./MatterPost";

/** Matter topic model. */
export interface MatterTopic {
  /** Identifier */
  id: number;
  /** Title */
  title: string;
  /** Matter identifier */
  matter: number;
  /** Last matter post */
  lastPost: MatterPost;
  /** Post count */
  postCount: string;
  /** Created at */
  created: Date;
  /** Modified at */
  modified: Date;
}
