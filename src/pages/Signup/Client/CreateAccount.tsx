import React, { useState, useEffect } from "react";
import { CreateAccountLayout } from "layouts";
import { FormInput, Button } from "components";
import { Formik, Form } from "formik";
import { isRegistered } from "api";
import { ClientRegisterDto } from "types";
import * as Yup from "yup";
// import { isEqual } from "lodash";
import styled from "styled-components";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Valid email is required")
    .required("Email is required"),
  password1: Yup.string()
    .min(8, "Must be at least 8 characters")
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_-])[A-Za-z\d@$!%*#?&._-]{8,}$/,
      "Must contain at least one special character and number"
    ),
  password2: Yup.string()
    .oneOf([Yup.ref("password1"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

interface Props {
  onNext(param): void;
  initData: ClientRegisterDto;
}

export const CreateAccountPage = ({ onNext, initData }: Props) => {
  const [error, setError] = useState("");
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);
  return (
    <CreateAccountLayout
      title="JustMediationHub"
      label="Sign Up with"
      desc="Access legal services that provide transparent, start-to-finish solutions and advice when and where you need it"
      feature="Client Features"
      features={[
        "One place for all your legal needs",
        "Legal help when and where you need it",
        "Empowering you through law",
      ]}
    >
      <Formik
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          // onNext(values);
          setError("");
          try {
            const res = await isRegistered(values.email);
            if (!res.data.is_registered) {
              onNext(values);
            } else {
              setError("This email is already registered.");
            }
          } catch (error: any) {
            setError(error.response.data?.message);
          }
        }}
      >
        {({ isSubmitting }) => {
          // const hasChanged = initialValues.email
          //   ? false
          //   : isEqual(values, initialValues);
          // const hasErrors = Object.keys(errors).length > 0;

          return (
            <div className="create-account-layout__form mx-auto">
              <Form>
                <div className="step mb-2">Step 1 of 2</div>
                <div className="title mb-3">Create your account</div>
                <FormInput
                  label="Email"
                  name="email"
                  isRequired
                  placeholder="Enter your email address"
                  className="mt-1"
                />
                <FormInput
                  label="Password"
                  type="password"
                  name="password1"
                  isRequired
                  placeholder="Create password"
                  help="Minimum of 8 characters, 1 number, and 1 symbol"
                  className="mt-3"
                />
                <FormInput
                  label="Confirm Password"
                  type="password"
                  name="password2"
                  isRequired
                  placeholder="Confirm your password"
                  className="mt-3"
                />

                {error && <Error className="text-center mt-3">{error}</Error>}

                <div className="d-flex mt-4 mb-2">
                  <Button
                    size="large"
                    isLoading={isSubmitting}
                    // disabled={hasChanged || hasErrors}
                    buttonType="submit"
                    widthFluid
                  >
                    Next
                  </Button>
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
    </CreateAccountLayout>
  );
};

const Error = styled.div`
  color: #cc4b39;
  font-size: 20px;
`;
