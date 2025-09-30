import { PaymentAccount } from "./PaymentAccount";

/**
 * Stripe card account information.
 */
export interface StripeBankAccount extends PaymentAccount {
  /** Brand. */
  brand: string;
  id: string;
  last4: string;
  bankName: string;
  isVerified: boolean;
}
