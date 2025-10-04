import { EventLocation } from "./EventLocation";

/** Event model. */
export interface MediatorEvent {
  /** ID */
  id: number;
  /** Mediator ID */
  mediatorId: number;
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
