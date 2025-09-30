import { PaymentMethodDto } from "./PaymentMethodDto";

import { SubscriptionDto } from "./SubscriptionDto";

/**
 * Payment profile DTO.
 */
export interface PaymentProfileDto {
  /**
   * Identifier
   */
  id: string;
  /**
   * Payment method ID.
   */
  payment_method: string;
  /**
   * Payment method
   */
  payment_method_data: PaymentMethodDto;
  /**
   * Subscription data.
   */
  subscription_data: SubscriptionDto;

  /**
   * Next subscription that will become current after renewal date.
   */
  next_subscription_data?: SubscriptionDto;
}
