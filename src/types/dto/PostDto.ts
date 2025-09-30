import { Role } from "../enum/Role";

import { ForumPostAuthorDto } from "./ForumPostAuthorDto";

/** Short information about topic. */
export interface TopicInfo {
  /** Id. */
  id: number;
  /** Title. */
  title: string;
}

/** Post model. */
export interface PostDto {
  /** Id. */
  id: number;
  /** Short topic info. */
  topic: number;
  /** Author. */
  author: ForumPostAuthorDto;
  /** Text. */
  text: string;
  /** Created. */
  created: string;
  /** Modified. */
  modified: string;
  /** User type */
  user_type: Role;
  /** Post position in post */
  position?: number;
}
