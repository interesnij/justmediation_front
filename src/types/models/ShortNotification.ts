import { NotificationType, NotificationStatus } from "../enum";

/** Short notification model. Contains the most significant information about a notification. */
export interface ShortNotification {
  /** Notification id. */
  id?: number;
  /** Text id of a notification. */
  type: NotificationType;
  /** Object id with which notification is connected. */
  objectId: number;
  /** Dispatch id. It should be used to update the status of notification. */
  dispatchId: number;
  /** Dispatch status */
  status: NotificationStatus;
}
