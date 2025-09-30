import { API } from "helpers";
import { PaymentProfileDto, JusLawSubscriptions as jls } from "types";

/**
 * Get current stripe profile
 */
export const getCurrentProfile = () => {
  return API().get("finance/profiles/current/");
};

/**
 * Update payment method for current user.
 * @param paymentMethodId Payment method ID.
 */
export const updatePaymentMethod = (paymentMethodId: string) => {
  return updatePaymentProfile({ payment_method: paymentMethodId });
};

/**
 * Update payment plan for current user.
 * @param paymentPlan New payment plan.
 */
export const updatePaymentPlan = (paymentPlan: jls.PaymentPlan) => {
  return API().post("finance/subscription/change/", {
    data: {
      plan: paymentPlan.id,
    },
  });
};
export const updatePaymentProfile = (data: Partial<PaymentProfileDto>) => {
  return API().put("finance/profiles/current/", { data });
};

/**
 * Get intent token for setup payment.
 */
export const getIntentToken = () => {
  return API().get("finance/subscribe/get-setup-intent/");
};

/**
 * Cancel current user's subscription.
 */
export const cancelCurrentSubscription = () => {
  return API().post("finance/subscription/cancel/");
};

/**
 * Reactivate current subscription.
 */
export const reactivateCurrentSubscription = () => {
  return API().post("finance/subscription/reactivate/");
};

/**
 * Get preview of a plan change.
 * @param nextPlan Next plan.
 */
export const getChangePlanPreview = (nextPlan: jls.PaymentPlan) => {
  return API().post("finance/subscription/change/preview/", {
    data: {
      plan: nextPlan.id,
    },
  });
};

/**
 * Get all available payment plans.
 */
export const getPaymentPlans = () => {
  return API().get("finance/plans/");
};
