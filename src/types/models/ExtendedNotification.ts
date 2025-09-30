import { ShortNotification } from "./ShortNotification";

/**
 * Extended notification model.
 *
 * It used for displaying information on notifications page. Contains specific information like date, content etc.
 */
export interface ExtendedNotification extends ShortNotification {
  /** Title. */
  title?: string;
  /** Text content. */
  content?: string;
  /** Id of notification type. */
  typeId?: number;
  /** Notification date. */
  date: Date;
}
