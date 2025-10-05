import React, { useState } from "react";
import { Button } from "components";
import { MediatorLayout } from "apps/mediator/layouts";
import { RouteComponentProps } from "@reach/router";
import { getFinanceAuthUrl } from "api";
import { useAuthContext } from "contexts";
import "./style.scss";

export const BankPage: React.FunctionComponent<RouteComponentProps> = () => {
  const { userType } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const handleSignIn = async () => {
    setIsLoading(true);
    const res = await getFinanceAuthUrl();
    window.open(res.data.url);
    setIsLoading(false);
  };
  return (
    <MediatorLayout title="Bank Accounts" userType={userType}>
      <div className="bank-page">
        <div className="my-auto">
          <div className="text-gray text-center">
            Sign in to Stripe to use accounting features
          </div>
          <Button
            onClick={handleSignIn}
            className="mx-auto mt-2"
            isLoading={isLoading}
          >
            Sign in
          </Button>
        </div>
      </div>
    </MediatorLayout>
  );
};
