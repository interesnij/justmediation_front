import React, { useState } from "react";
import { RouteComponentProps, useLocation, navigate } from "@reach/router";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useCommonUIContext } from "contexts";
import { FormInput, Button } from "components";
import { resetPasswordConfirm } from "api";
import { LoginLayout } from "layouts";
import { parse } from "query-string";
import "./style.scss";
const validationSchema = Yup.object().shape({
  new_password1: Yup.string()
    .min(8, "Must be at least 8 characters")
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_-])[A-Za-z\d@$!%*#?&._-]{8,}$/,
      "Must contain at least one special character and number"
    ),
  new_password2: Yup.string()
    .oneOf([Yup.ref("new_password1"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const ResetPasswordPage: React.FC<RouteComponentProps> = () => {
  const [isSent, setIsSent] = useState(false);
  const { showErrorModal } = useCommonUIContext();
  const location = useLocation();
  const { key } = parse(location.search);
  const returnToLogin = () => {
    navigate("/");
  };
  return (
    <LoginLayout>
      <div className="login-page__container my-auto">
        <h1 className="text-center">Reset Password</h1>
        {isSent && (
          <>
            <p className="text-center mt-4">
              Your new password has now been reset, please go back and log in
              again.
            </p>
            <Button
              widthFluid
              size="large"
              className="mt-4"
              onClick={returnToLogin}
            >
              Return to Login In
            </Button>
          </>
        )}
        {!isSent && (
          <div className="forgot-container__form my-4">
            <Formik
              initialValues={{
                new_password1: "",
                new_password2: "",
                uid: (key as String)?.split("-")[0],
                token: `${(key as String)?.split("-")[1]}-${
                  (key as String)?.split("-")[2]
                }`,
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                try {
                  await resetPasswordConfirm(values);
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
                      name="new_password1"
                      label="New password"
                      type="password"
                      isRequired
                    />
                    <FormInput
                      className="mt-2"
                      name="new_password2"
                      label="Confirm new password"
                      type="password"
                      isRequired
                    />
                    <div className="mt-3 d-flex justify-content-center">
                      <Button
                        widthFluid
                        size="large"
                        isLoading={isSubmitting}
                        buttonType="submit"
                      >
                        Reset Password
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        )}
      </div>
    </LoginLayout>
  );
};
