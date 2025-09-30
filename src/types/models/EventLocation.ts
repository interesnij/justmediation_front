export const DEFAULT_TIMEZONE = "local";

/**
 * Event location.
 * Describe location of an event.
 */
export interface EventLocation {
  /**
   * Location name.
   */
  name: string;

  /**
   * Timezone of location.
   * Is required to display a date/time in timezone of event location.
   */
  timezone: string;
}
