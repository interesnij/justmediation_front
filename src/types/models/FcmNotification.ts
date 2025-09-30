import { ShortNotification } from './ShortNotification';

/**
 * Firebase cloud message notification model.
 *
 * It is the part of our domain notification model,
 *  because our push notifications contain domain-specific information mixed with fcm properties.
 */
export interface FcmNotification extends ShortNotification {
  /** Is a foreground notification. */
  isTapped: boolean;
}
