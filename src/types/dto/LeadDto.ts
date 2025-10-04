// import { MediatorDto } from "./MediatorDto";
import { ClientDto } from "./ClientDto";
import { TopicDto } from "./TopicDto";

/**
 * Lead DTO.
 */
export interface LeadDto {
  /**
   * ID.
   */
  id: number;

  /**
   * Mediator ID.
   */
  mediator: number;

  /**
   * mediator data.
   */
  // mediator_data: Partial<MediatorDto>;

  /**
   * Topic ID.
   */
  topic: number;

  /**
   * Topic DTO.
   */
  topic_data: TopicDto;

  /**
   * Client DTO.
   */
  client_data: Partial<ClientDto>;

  /**
   * Last message.
   */
  last_message: string;

  /**
   * Lead priority.
   */
  priority: "high" | "medium" | "low";

  /**
   * Chat ID.
   */
  chat_channel: string;

  /**
   * Date of creation.
   */
  created: string;
}

/**
 * DTO to create a lead.
 */
export interface CreateLeadDto {
  /**
   * Client ID.
   */
  client: number;

  /**
   * Mediator ID.
   */
  mediator: number;

  /**
   * Topic ID.
   */
  topic: number;

  /**
   * Priority.
   */
  priority: LeadDto["priority"];
}
