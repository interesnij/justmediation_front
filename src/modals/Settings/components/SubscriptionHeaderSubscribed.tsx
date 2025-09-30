import React, {FC} from "react";
import {Button} from "components";
import {format} from "date-fns";

interface iProps {
  handleChangeSubscription: () => void;
  data: any;
}

export const SubscriptionHeaderSubscribed: FC<iProps> = ({data, handleChangeSubscription}) => {

  const subscriptionType: string = data?.subscription_data?.plan_data?.product_data?.name || ""
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div className="heading my-auto capitalize">{subscriptionType}</div>
        <Button type="outline" onClick={handleChangeSubscription}>
          Change subscription
        </Button>
      </div>
      <div className="row mt-1">
        <div className="col-md-4">
          <div className="label">LAST PAYMENT</div>
          <div className="desc">
            {data?.subscription_data?.start
              ? format(
                new Date(data?.subscription_data?.current_period_start),
                "MMM dd, yyyy"
              )
              : "-"}
          </div>
        </div>
        <div className="col-md-4">
          <div className="label">NEXT BILLING DATE</div>
          <div className="desc">
            {data?.subscription_data?.cancel_at_period_end
              ? "-"
              : format(
                new Date(
                  data?.subscription_data?.current_period_end
                ),
                "MMM dd, yyyy"
              )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="label">PRICE</div>
          <div className="desc">
            ${data?.subscription_data?.plan_data?.amount} /{" "}
            {data?.subscription_data?.plan_data?.interval}
          </div>
        </div>
      </div>
    </>
  )
}