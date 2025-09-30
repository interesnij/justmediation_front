import { EventLocation } from "./EventLocation";

/** Event model. */
export interface AttorneyEvent {
  /** ID */
  id: number;
  /** Attorney ID */
  attorneyId: number;
  /** Title */
  title: string;
  /** Description */
  description: string;
  /** Is event is all day */
  isAllDay: boolean;
  /** Start date-time */
  start: Date;
  /** End date-time */
  end: Date;
  /** Duration */
  duration: string;
  /** Location */
  location: EventLocation;
}
