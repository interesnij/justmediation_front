import { API } from "helpers";
import { Subscription } from "types";

/**
 * Submit subscription
 */
export const submitSubscription = (params: Subscription) => {
  return API().post("finance/subscription/", params);
};

/**
 * Change subscription
 */
export const changeSubscription = (params) => {
  return API().post("finance/subscription/change/", params);
};

/**
 * Cancel subscription
 */
export const cancelSubscription = () => {
  return API().post("finance/subscription/cancel/");
};

/**
 * Get stripe auth url
 */
export const getFinanceAuthUrl = () => {
  return API().get("finance/deposits/profiles/current/onboarding-url/");
};

/**
 * Get current subscription profile
 */
export const getCurrentSubscriptionProfile = async () => {
  try {
    const res = await API().get("finance/profiles/current/");
    return res.data;
  } catch (error) {
    return error;
  }
};

/**
 * Put current profiles
 */
export const updateFinanceProfile = async (body) => {
  const res = await API().put("finance/profiles/current/", body);
  return res.data;
};

/**
 * Get all plans
 */
export const getAllPlans = async () => {
  const res = await API().get("finance/plans/");
  return res.data;
};

/**
 * Reactivate subscription plan
 */
export const reactivateSubscriptionPlan = async () => {
  try {
    const res = await API().post("finance/subscription/reactivate/");
    return res.data;
  } catch (error) {
    return {};
  }
};

/**
 * Get payment method
 */
export const getPaymentMethod = async () => {
  const res = await API().get("finance/payment-method/");
  return res.data.results;
};

/**
 * Add payment method
 */
export const addPaymentMethod = async (token) => {
  return API().post("finance/payment-method/", { token });
};

/**
 * Remove payment method
 */
export const removePaymentMethod = async (token) => {
  const res = await API().delete(`finance/payment-method/${token}/`);
  return res.data;
};
