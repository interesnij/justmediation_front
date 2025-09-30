import { Message } from "./Message";

/**
 * Attachment model.
 *
 * Used only in Text message.
 */
export interface Attachment {
  /** Attachment title. */
  title: string;
  /** Attachment url. */
  url: string;
}

/**
 * Text message.
 */
export interface TextMessage extends Message {
  /** Message text. */
  text: string;

  /** Attachment. */
  files: Attachment[];
}
