import { PaymentAccount } from "./PaymentAccount";

/**
 * Stripe card account information.
 */
export interface StripeCardAccount extends PaymentAccount {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isVerified: boolean;
}
