import React from "react";
import { RouteComponentProps, navigate } from "@reach/router";
import { Button } from "components";
import { LoginLayout } from "layouts";
import "./style.scss";

export const NotFoundPage: React.FC<RouteComponentProps> = () => {
  const returnToLogin = () => {
    navigate("/");
  };

  return (
    <LoginLayout>
      <div className="login-page__container mt-auto">
        <h1 className="mb-4 mt-0">Page Not Found</h1>
        <div className="text-dark">
          Sorry, we couldn’t find the page you’re looking for.
        </div>
        <div className="d-flex mt-4">
          <Button widthFluid size="large" type="outline">
            Go Back
          </Button>

          <Button
            widthFluid
            className="ml-4"
            onClick={returnToLogin}
            size="large"
          >
            Return Home
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
