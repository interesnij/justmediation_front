import firebase from "firebase";

/** Chat message type. */
export type FirestoreChatMessageType = "text" | "announce";

/**
 * Firestore chat message date DTO.
 * {firestore.Timestamp} for retrieved data from firestore.
 * {firestore.FieldValue} for set server timestamp as a value using `firestore.FieldValue.serverTimestamp()`.
 * {number} for backward compatibility.
 */
export type FirestoreChatMessageDateDto =
  | firebase.firestore.Timestamp
  | firebase.firestore.FieldValue
  | number;
/**
 * Firestore chat message model.
 */
export interface FirestoreChatMessage {
  /**
   * ID.
   */
  id?: string;
  /**
   * Date created.
   */
  created: FirestoreChatMessageDateDto;
  /**
   * Type.
   */
  type: FirestoreChatMessageType;
  /**
   * Author ID.
   */
  authorId: string;
}

/**
 * Firestore text message attachment.
 */
export interface FirestoreTextMessageAttachment {
  /** Attachment title. */
  title: string;
  /** Attachment url. */
  url: string;
  /** Attachment size. */
  size: number;
}

/** Firestore text message dto model. */
export interface FirestoreChatTextMessage extends FirestoreChatMessage {
  /** Message text. */
  text: string;
  /** Attached files. */
  files: FirestoreTextMessageAttachment[];
  /** Announce message type. */
  readonly type: "text";
}

/** Firestore announce emssage dto. */
export interface FirestoreAnnounceMessage extends FirestoreChatMessage {
  /** Announce text. */
  readonly text: string;
  /** Announce message type. */
  readonly type: "announce";
}

/**
 * Firestore chat document fields.
 */
export interface FirestoreChatFields {
  /**
   * Participants.
   */
  participants: number[];
}

/**
 * Firestore chat.
 */
export interface FirestoreChat extends FirestoreChatFields {
  /**
   * ID.
   */
  id: string;
}

/**
 * Firestore user chat.
 */
export interface FirestoreUserChat extends FirestoreUserChatFields {
  /**
   * Chat ID.
   */
  chatId: string;
}

/**
 * Firestore user chat statistic document fields.
 */
export interface FirestoreUserChatFields {
  /**
   * Count unread.
   */
  count_unread: number;
  /**
   * First name another participant.
   */
  first_name_another_participant: string;
  /**
   * Last name another participant.
   */
  last_name_another_participant: string;
  /**
   * Last read message ID.
   */
  last_read_post: string;
  /**
   * Last chat message text.
   */
  last_chat_message_text: string;
  /**
   * Last chat message date.
   */
  last_chat_message_date: number;
}

/**
 * Firestore user document fields.
 */
// tslint:disable-next-line: no-empty-interface
export interface FirestoreUserFields {}

/**
 * Firestore user.
 */
export interface FirestoreUser extends FirestoreUserFields {
  /**
   * ID.
   */
  id: string;
}
