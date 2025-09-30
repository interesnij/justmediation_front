import { Role } from "../enum";

import { ForumPostAuthor } from "./ForumPostAuthor";

/** Post model. */
export interface Post {
  /** Id. */
  id?: number;
  /** Topic id. */
  topic: number;
  /** Author. */
  author?: ForumPostAuthor;
  /** Title. */
  title: string;
  /** Text. */
  message: string;
  /** Created. */
  created?: string;
  /** Modified. */
  modified?: string;
  /** User type */
  userType?: Role;
  /** Post position in topic */
  position?: number;
}
