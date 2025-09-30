import { NotificationGroupDto } from "./NotificationGroupDto";
import { NotificationTypeDto } from "./NotificationTypeDto";

/** Dto for notifications type model. */
export interface NotificationTypeDescriptionDto {
  /** Id */
  id: number;

  /** Human-readable name of a type */
  title: string;

  /** Code related name of notification type */
  runtime_tag: NotificationTypeDto;

  /** Describes notification type receiver */
  recipient_type: "client" | "attorney" | "all";

  /** Group */
  group: NotificationGroupDto;
}
