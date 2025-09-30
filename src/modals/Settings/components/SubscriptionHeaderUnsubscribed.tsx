import React, {FC} from "react";
import {Button} from "components";
import moment from "moment";

interface iProps {
  handleChooseSubscription: () => void;
  data: any;
}

export const SubscriptionHeaderUnsubscribed: FC<iProps> = ({data, handleChooseSubscription}) => {

  const planType = data?.subscription_data?.plan_data?.interval || "";

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3 className="subscription-heading">Subscription Cancelled</h3>
          <p className="subscription-desc">
            Previous Subscription: <span className="capitalize">{planType + "Plan"}</span>
            (Expired {moment(data?.subscription_data?.current_period_end).format("MMM DD, YYYY")})
          </p>
        </div>
        <Button onClick={handleChooseSubscription}>
          Choose a Plan
        </Button>
      </div>
    </>
  )
}