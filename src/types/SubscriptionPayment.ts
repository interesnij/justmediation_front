/**
 * Payment form in the onboarding subscription page
 */

export interface SubscriptionPayment {
  /**
   * Name on card
   */
  card_name: string;

  /**
   * Card Number
   */
  card_number: string;

  /**
   * Card Exp Date
   */
  card_exp_date: string;

  /**
   * Card CVC
   */
  card_cvc: number;

  /**
   * Billing country
   */
  billing_country: string;

  /**
   * Billing state
   */
  billing_state: string;

  /**
   * Billing city
   */
  billing_city: string;

  /**
   * Billing zip code
   */
  billing_zip_code: string;

  /**
   * Billing address 1
   */
  billing_address1: string;

  /**
   * Billing address 2
   */
  billing_address2: string;
}
