import { NotificationTypeDescription } from "./NotificationConfig";

/** Notifications type or group. */
export type NotificationTypeDescriptionOrGroup =
  | NotificationTypeDescription
  | NotificationGroup;

/** Notifications Group */
export interface NotificationGroup {
  /** Id */
  id: number;

  /** Notification group title which will be displayed for the user */
  title: string;

  /** Notifications Types */
  types: NotificationTypeDescription[];
}
