import React, { useState } from "react";
import { RouteComponentProps, useLocation, navigate } from "@reach/router";
import { Button } from "components";
import { LoginLayout } from "layouts";
import { parse } from "query-string";
import { resendConfirmEmail } from "api";
import "./style.scss";

export const EmailVerifiedPage: React.FC<RouteComponentProps> = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { success, email } = parse(location.search);

  const returnToLogin = () => {
    navigate("/");
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    const res = await resendConfirmEmail({ email });
    setMessage(res.data.email);
    setIsLoading(false);
  };

  return (
    <LoginLayout>
      <div className="login-page__container mt-auto">
        <h1 className="mb-4 mt-0">
          {success === "true"
            ? "Email Successfully Confirmed"
            : "Email Verification Failed"}
        </h1>
        <div className="text-dark"></div>
        <div className="d-flex mt-4">
          {message ? (
            <div className="text-center">{message}</div>
          ) : success === "true" ? (
            <Button
              widthFluid
              className="mx-auto"
              onClick={returnToLogin}
              size="large"
            >
              Return To Home
            </Button>
          ) : (
            <Button
              widthFluid
              className="mx-auto"
              onClick={handleResendVerification}
              size="large"
              isLoading={isLoading}
            >
              Resent verification link
            </Button>
          )}
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
