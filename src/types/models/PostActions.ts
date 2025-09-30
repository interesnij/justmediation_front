import { PostActions } from "../enum";
/** Post action */
export interface PostAction {
  /** Action. */
  id: PostActions;
  /** Human-readable value */
  value: string;
}
