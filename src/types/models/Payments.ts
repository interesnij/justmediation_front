import { PaymentStatus } from "../enum";
/** Payments secret data. */
export interface PaymentSecret {
  /** Payment session token. */
  readonly clientSecret: string;
  /** Status. */
  readonly status: string;
}

/** Payment info interface. */
export interface PaymentInfo {
  /** Id. */
  readonly id: number;
  /** Payer id. */
  readonly payerId: number;
  /** Recipient id. */
  readonly recipientId: number;
  /** Amount. */
  readonly amount: string;
  /** Description. */
  readonly description: string;
  /** Status. */
  readonly status: PaymentStatus;
  /** Paymentsecret. */
  readonly paymentSecret: PaymentSecret;
}
