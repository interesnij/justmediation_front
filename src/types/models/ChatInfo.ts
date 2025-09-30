import { User } from "./User";

/**
 * Chat info.
 */
export interface ChatInfo {
  /**
   * Chat ID.
   */
  id?: string;

  /**
   * Count unread messages.
   */
  countUnreadMessages: number;

  /**
   * Last read message ID.
   */
  lastReadMessageId?: string;

  /**
   * Last chat message text.
   */
  lastMessageText: string;

  /**
   * Last chat message date.
   */
  lastMessageDate: Date;

  /**
   * Sender.
   */
  sender: User;

  /**
   * Date of creation.
   */
  created: Date;
}
