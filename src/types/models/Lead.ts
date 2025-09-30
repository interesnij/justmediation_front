import { Attorney, Client, Topic } from "./";
import { LeadPriority } from "../enum";

/**
 * Lead model.
 * Provides ability to chatting between Attorney and Client.
 */
export interface Lead {
  /**
   * ID.
   */
  id: number;

  /**
   * Attorney ID.
   */
  attorney: Attorney;

  /**
   * Topic data.
   */
  topic: Topic;

  /**
   * Client data.
   */
  client: Client;

  /**
   * Last message.
   */
  lastMessage: string;

  /**
   * Priority.
   */
  priority: LeadPriority;

  /**
   * Chat channel ID.
   */
  chatId: string;

  /**
   * Date of creation.
   */
  created: Date;
}
