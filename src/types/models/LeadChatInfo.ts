import { Lead, ChatInfo, User } from "./";

/**
 * Lead chat info.
 * Describes a chat between attorney and client in the context of lead.
 */
export interface LeadChatInfo extends ChatInfo {
  /**
   * Corresponding lead.
   */
  readonly lead: Lead;

  /**
   * Recipients. Only one.
   */
  readonly recipients: [User];
}
