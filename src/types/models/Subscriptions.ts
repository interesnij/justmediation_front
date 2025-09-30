import { PaymentMethod } from "./PaymentMethod";
import { PaymentInterval } from "../enum";
export namespace JusLawSubscriptions {
  export const STATUS_TITLE_MAP = new Map<Subscription["status"], string>([
    ["active", "Active"],
    // Canceled means canceling was requested but the subscription will not be removed until the payment period is ended.
    ["canceled", "Active"],
    ["incomplete", "Active"],
    ["trialing", "Trialing"],
    ["incomplete_expired", "Incomplete Expired"],
    ["past_due", "Past Due"],
    ["unpaid", "Unpaid"],
  ]);

  /** These statuses might be considered as active. */
  export const ACTIVE_STATUSES = [
    "active",
    "canceled",
    "incomplete",
    "trialing",
  ];

  /**
   * Subscription.
   * Described payment subscription.
   */
  export interface Subscription {
    /**
     * ID.
     */
    id: string;

    /**
     * Status.
     */
    status:
      | "active"
      | "canceled"
      | "incomplete"
      | "incomplete_expired"
      | "past_due"
      | "trialing"
      | "unpaid";

    /**
     * Renewal date
     */
    renewalDate: Date | null;

    /**
     * Date of cancel.
     */
    canceledDate: Date | null;

    /**
     * Payment plan for subscription.
     */
    plan: PaymentPlan;

    /**
     * Is cancel at period end requested.
     */
    cancelAtPeriodEnd: boolean;
  }

  /**
   * Payment plan model.
   */
  export interface PaymentPlan {
    /** Id */
    id: string;
    /** Amount (as decimal) to be charged on the interval specified */
    amount: number;
    /** Three-letter ISO currency code */
    currency: string;
    /** The frequency with which a subscription should be billed */
    interval: PaymentInterval;
    /** A brief description of the plan, hidden from customers */
    nickname: string;
    /** The product whose pricing this plan determines. */
    product: number;
    /** Number of trial period days granted when subscribing a customer to this plan. Null if the plan has no trial period. */
    trialPeriodDays: number;

    /**
     * Plan title.
     */
    name: string;

    /**
     * Plan description.
     */
    description: string;

    /**
     * Payment plan interval title.
     */
    intervalTitle: string;

    /**
     * Amount per day.
     */
    amountPerDay: number;

    /**
     * Is plan "premium".
     */
    isPremium: boolean;
  }

  /**
   * Payment profile model.
   * Presents information about payment profile (includes payment plan and payment method).
   */
  export interface PaymentProfile {
    /**
     * ID.
     */
    id: string;

    /**
     * Current subscription.
     */
    subscription: Subscription | null;

    /**
     * Next subscription that will become current after current expired.
     */
    nextSubscription: Subscription | null;

    /**
     * Payment method.
     */
    method: PaymentMethod;
  }
}
