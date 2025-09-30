import {useBasicDataContext} from "../BasicData";
import {useState} from "react";
import {navigate} from "@reach/router";

export const forbiddenAttorneyUnsubscribedRoutes = [
  "/attorney/matters",
  "/attorney/chats",
  "/attorney/billing",
  "/attorney/engagement",
  "/attorney/forums"
]


export const useSubscriptionAccess = () => {

  const {pathname} = window.location;
  const {subscriptionInfo} = useBasicDataContext();
  const subscription_data = subscriptionInfo?.subscription_data || null;
  const [forbiddenRoutes, setForbiddenRoutes] = useState([]);

  const hasSubscriptionPlan = (subscription_data?.status === "trialing" || subscription_data?.status === "active") && !subscription_data?.cancel_at_period_end;
  const hasSubscriptionCancelled = (subscription_data?.status === "trialing" || subscription_data?.status === "active") && subscription_data?.cancel_at_period_end;
  const unsubscribed = subscription_data?.status !== "trialing" && subscription_data?.status !== "active";

  //const hasSubscription = !unsubscribed;
  const hasSubscription = true; 

  const isDisabledUrl = (url?: string) => (forbiddenAttorneyUnsubscribedRoutes.some(key => {
    return url?.includes(key) || pathname.includes(key)
  })) 

  if(!hasSubscription && isDisabledUrl()) {
    navigate(-1);
  }

  return {
    forbiddenRoutes,
    hasSubscription,
    hasSubscriptionCancelled,
    unsubscribed,
    isDisabledUrl
  }
}