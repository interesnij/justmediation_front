import React, { useState } from "react";
import { Link, RouteComponentProps, navigate } from "@reach/router";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormInput, Button } from "components";
import { useCommonUIContext } from "contexts";
import { LoginLayout } from "layouts";
import { resetPassword } from "api";

import "./style.scss";
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Valid email is required")
    .required("Email is required"),
});

export const ForgotPasswordPage: React.FC<RouteComponentProps> = () => {
  const [isSent, setIsSent] = useState(false);
  const { showErrorModal } = useCommonUIContext();
  const returnToLogin = () => {
    navigate("/");
  };

  return (
    <LoginLayout>
      <div className="login-page__container mt-auto">
        <h1 className="text-center">
          {isSent ? "Password Reset" : "Forgot Password"}
        </h1>
        {isSent ? (
          <div>
            <p className="text-center forgot-password-page-text mt-4">
              A message has been sent to you by email with instructions on how
              to reset your password.
            </p>
            <Button
              widthFluid
              size="large"
              className="mt-4"
              onClick={returnToLogin}
            >
              Return to Log In
            </Button>
          </div>
        ) : (
          <p className="text-center forgot-password-page-text mt-4">
            Enter the email address that you used to register. We'll send you an
            email with a link to reset your password.
          </p>
        )}
        {!isSent && (
          <div className="forgot-container__form my-4">
            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                try {
                  await resetPassword(values);
                  setIsSent(true);
                } catch (error: any) {
                  showErrorModal("error", error);
                }
              }}
            >
              {({ isSubmitting }) => {
                return (
                  <Form>
                    <FormInput
                      className="mt-4"
                      name="email"
                      placeholder="Enter your email address"
                      isRequired
                    />
                    <div className="mt-4 d-flex justify-content-center">
                      <Button
                        isLoading={isSubmitting}
                        widthFluid
                        size="large"
                        buttonType="submit"
                      >
                        Send Reset Email
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        )}
      </div>
      <div className="login-page__footer mb-auto">
        <span>If you need help, contact</span>&nbsp;
        <Link to="/policy">JustLaw Support</Link>.
      </div>
    </LoginLayout>
  );
};
