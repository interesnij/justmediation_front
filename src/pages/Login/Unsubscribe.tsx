import React, { useState } from "react";
import { RouteComponentProps, navigate, useLocation } from "@reach/router";
import { Button } from "components";
import { LoginLayout } from "layouts";
import { parse } from "query-string";
import { unsubscribeUser } from "api";
// import { useCommonUIContext } from "contexts";
import "./style.scss";

export const UnsubscribePage: React.FC<RouteComponentProps> = () => {
  const location = useLocation();
  const { key } = parse(location.search);
  const [isLoading, setIsLoading] = useState(false);

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      await unsubscribeUser(key as string);
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      navigate("/");
    }
  };

  return (
    <LoginLayout>
      <div className="login-page__container mt-auto">
        <h1 className="mb-4 mt-0">Do you want to unsubscribe?</h1>

        <div className="d-flex mt-4">
          <Button
            widthFluid
            className="ml-4"
            onClick={handleUnsubscribe}
            size="large"
            isLoading={isLoading}
          >
            Unsubscribe email
          </Button>
        </div>
      </div>
      <div className="login-page__footer mb-auto">
        <span>Before logging in, you can read our</span>&nbsp;
        <a href="/privacy-policy" target="_blank" rel="noreferrer">
          Privacy Policy
        </a>
        &nbsp; <span>and</span> &nbsp;
        <a href="/terms-of-use" target="_blank" rel="noreferrer">
          Terms of Service
        </a>
      </div>
    </LoginLayout>
  );
};
