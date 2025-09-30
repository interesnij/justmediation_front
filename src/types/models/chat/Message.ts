import { User } from "../User";

/**
 * Chat message.
 */
export interface Message {
  /**
   * Message ID.
   */
  id?: string;
  /**
   * Sender.s
   */
  author: User;
  /**
   * Created date.
   */
  created: Date;
  /**
   * Is the current message belongs to the current user.
   */
  isMyMessage?: boolean;
}
