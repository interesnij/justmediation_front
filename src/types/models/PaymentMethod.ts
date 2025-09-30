/**
 * Payment method.
 */
export interface PaymentMethod {
  /**
   * Brand
   */
  brand: string;

  /**
   * Expiration month
   */
  expMonth: number;

  /**
   * Expiration year
   */
  expYear: number;

  /**
   * Last 4 digits
   */
  last4: string;
}
