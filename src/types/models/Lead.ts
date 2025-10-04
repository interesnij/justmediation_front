import { Mediator, Client, Topic } from "./";
import { LeadPriority } from "../enum";

/**
 * Lead model.
 * Provides ability to chatting between Mediator and Client.
 */
export interface Lead {
  /**
   * ID.
   */
  id: number;

  /**
   * Mediator ID.
   */
  mediator: Mediator;

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
