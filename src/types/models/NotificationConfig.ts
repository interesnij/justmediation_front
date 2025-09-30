import { NotificationType } from "../enum";

/** Keys of notifications settings values */
export type NotificationsSettingsKey = "byEmail" | "byPush";

/** Notifications settings model type. */
export type NotificationsSettings = {
  [key in NotificationsSettingsKey]: boolean;
};

/** Extended information about notification type. */
export interface NotificationTypeDescription {
  /** Id. */
  id: number;

  /** Human-readable name of a type. */
  title: string;

  /** Current settings of this notifications type. */
  settings: NotificationsSettings;

  /** Type of notification. */
  type: NotificationType;
}
