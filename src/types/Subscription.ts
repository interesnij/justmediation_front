export interface Subscription {
  /**
   * User email
   */
  user_id?: string;

  /**
   * Subscription Plan Id
   */
  plan_id?: string;

  /**
   * Token from stripe
   */
  token?: string;
}
