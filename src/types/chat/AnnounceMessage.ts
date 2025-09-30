import { Message } from "./Message";

/** Announce message. */
export interface AnnounceMessage extends Message {
  /** Announce text. */
  text: string;
}
