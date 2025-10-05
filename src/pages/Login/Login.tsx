import React, { useState, useEffect } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { Button, FormInput, FormCheckbox } from "components";
import { useAuthContext } from "contexts/Auth";
import { useBasicDataContext, useTimerContext } from "contexts";
import {
  login as loginApi,
  getMediatorById,
  getParalegalById,
  check2FA,
  validateLogin,
  getClientById,
  getEnterpriseAccountById
} from "api";
import { Formik, Form } from "formik";
import { getFirebaseToken, send2FA } from "api";
import { useAuth } from "reactfire";
import * as Yup from "yup";
import { formatPhoneNumber } from "helpers";
// import { isEqual } from "lodash";
import ConfirmedIcon from "assets/icons/confirmed.svg";
import styled from "styled-components";
import { LoginLayout } from "layouts";
import "./style.scss";

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Valid email is required")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_-])[A-Za-z\d@$!%*#?&._-]{8,}$/,
      "Must contain at least one special character and number"
    ),
});

const codeValidationSchema = Yup.object().shape({
  code: Yup.string().required("Code is required"),
});

export const LoginPage: React.FC<RouteComponentProps> = () => {
  const { login, keep, redirectPage, userType, userId, avatar } = useAuthContext();
  const { initBasicData } = useBasicDataContext();
  const { initTimer } = useTimerContext();
  const auth = useAuth();
  const [error, setError] = useState("");


  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginFirestore = async () => {
    const res = await getFirebaseToken();
    auth.signInWithCustomToken(res.data.token);
  };

  // It is redirect when the user is logged
  useEffect(() => {
    userType && userId && avatar && redirectPage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, userId, avatar]);

  // It doesn't work correctly
  // when the user is logged and entered to the login page
  useEffect(() => {
    if (keep) {
      redirectPage();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    send2FA(phone);
    setStep((state) => state + 1);
  };

  const getProfile = (type: string, id: number) => {
    switch (type) {
      case 'client': 
        return getClientById(id);
      case 'paralegal':
      case 'other':
        return getParalegalById(id);
      case 'enterprise':
        return getEnterpriseAccountById(id);
      case 'mediator':
      default: 
        return getMediatorById(id);
    }
  }

  const handleLogin = async (values) => {
    setError("");
    try {
      let validateRes: any = await validateLogin(values);
      if (!validateRes?.data?.success) {
        setError(
          validateRes?.data?.detail ||
          validateRes?.response?.data?.detail || 
          "User is not verified yet"
        );
        return;
      }
      let tfaRes = await check2FA(values.email);
      if (tfaRes.twofa && tfaRes.phone) {
        setPhone(tfaRes.phone);
        setEmail(values.email);
        setPassword(values.password);
        setStep(1);
      } else {
        try {
          let res: any = await loginApi(values.email, values.password, "");
          if (!res?.data?.key) {
            setError(
              res?.data?.detail ||
              res?.response?.data?.detail || 
              "Error occur while authenticating user" 
            );
            return;
          }
          localStorage.setItem("key", res.data.key);
          const profile = await getProfile(
            res.data.user_type, 
            res.data.user_id
          ) || {};
          try {
            await initBasicData(res.data.user_type);
            await loginFirestore();
            initTimer();
            login(
              res.data.key,
              res.data.user_type,
              values.email,
              res.data.user_id,
              res.data.plan_id,
              res.data.avatar,
              profile,
              values.keep,
              tfaRes.twofa,
              res.data.phone,
              res.data.role
            );
          } catch (error) {
            console.log("error", error);
            setError("Error occured while initializing user");
          }
        } catch (error: any) {
          setError(
            error?.response?.data?.detail ||
            "Error occur while authenticating user" 
          );
        }
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.detail || 
        "Invalid credential"
      );
    }
  };

  const handleSendCode = async (code) => {
    try {
      let res: any = await loginApi(email, password, code);
      if (!res?.data?.key) {
        setError(
          res?.data?.detail ||
          res?.response?.data?.detail || 
          "Error occur while authenticating user" 
        );
        return;
      }
      setStep((state) => state + 1);
      localStorage.setItem("key", res.data.key);
      const profile = await getProfile(
        res.data.user_type, 
        res.data.user_id
      ) || {};
      await initBasicData(res.data.user_type);
      await loginFirestore();

      initTimer();
      login(
        res.data.key,
        res.data.user_type,
        email,
        res.data.user_id,
        res.data.plan_id,
        res.data.avatar,
        profile,
        keep,
        true,
        res.data.phone,
        res.data.role
      );
      setTimeout(() => {}, 1000);
    } catch (error: any) {
      setError(
        error?.response?.data?.detail ||
        "Error occur while authenticating user" 
      );
    }
  };
  return (
    <LoginLayout>
      <div className="login-page__container mt-auto">
        {step === 0 ? (
          <>
            <h1 className="mb-4 mt-0">Log In</h1>
            <Formik
              initialValues={{
                email: "",
                password: "",
                keep: false,
              }}
              validationSchema={loginValidationSchema}
              onSubmit={async (values) => {
                await handleLogin(values);
              }}
            >
              {({ isSubmitting }) => {
                // const hasChanged = initialValues.email
                //   ? false
                //   : isEqual(values, initialValues);
                // const hasErrors = Object.keys(errors).length > 0;

                return (
                  <Form>
                    <FormInput
                      label="Email"
                      name="email"
                      placeholder="Enter your email address"
                      isRequired
                    />
                    <FormInput
                      label="Password"
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      className="mt-2"
                      isRequired
                    />
                    <div className="d-flex">
                      <Link
                        to="/auth/forgot-password"
                        className="ml-auto mt-1 forgot"
                      >
                        Forgot password
                      </Link>
                    </div>
                    <FormCheckbox name="keep" className="mt-2">
                      Keep me signed into JustMediationHub
                    </FormCheckbox>
                    {error && (
                      <Error className="mt-3 text-center">{error}</Error>
                    )}
                    <div className="d-flex mt-4">
                      <Button
                        widthFluid
                        className="ml-auto"
                        buttonType="submit"
                        size="large"
                        // disabled={hasChanged || hasErrors}
                        isLoading={isSubmitting}
                      >
                        Login
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </>
        ) : step === 1 ? (
          <>
            <h1 className="mt-0">Quick security check</h1>
            <div className="mt-1 text-gray text-center">
              We just need some info to verify it's you
            </div>
            <div className="mt-3 text-dark text-center">
              Text security code to {formatPhoneNumber(phone)}
            </div>
            <div className="d-flex mt-4">
              <Button
                widthFluid
                className="ml-auto"
                buttonType="submit"
                size="large"
                onClick={handleContinue}
              >
                Send Text
              </Button>
            </div>
            <Desc className="mt-2">
              By continuing, you confirm that you are authorized to use this
              phone number and agree to receive text messages to confirm your
              identity in this session. Carrier fees may apply.
            </Desc>
          </>
        ) : step === 2 ? (
          <Formik
            initialValues={{
              code: "",
            }}
            validationSchema={codeValidationSchema}
            onSubmit={async (values) => {
              setError("");
              await handleSendCode(values.code);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <h1 className="mb-4 mt-0">Type in your code</h1>
                <div className="text-gray text-center">
                  We sent a security code to {formatPhoneNumber(phone)}.
                  <br />
                  Enter the code to continue.
                </div>
                <FormInput
                  className="mt-4"
                  label=""
                  name="code"
                  placeholder="Security code"
                />
                {error && <Error className="mt-3 text-center">{error}</Error>}
                <div className="d-flex mt-4">
                  <Button
                    widthFluid
                    className="ml-auto"
                    buttonType="submit"
                    size="large"
                    isLoading={isSubmitting}
                  >
                    Continue
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <>
            <div className="d-flex">
              <img
                className="mx-auto mb-3"
                src={ConfirmedIcon}
                alt="confirmed"
              />
            </div>
            <h1 className="mt-0">Identity Confirmed</h1>
            <div className="mt-2 text-gray text-center">
              Redirecting to the dashboard...
            </div>
          </>
        )}
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

const Error = styled.div`
  color: #cc4b39;
  font-size: 16px;
`;

const Desc = styled.div`
  font-size: 12px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #98989a;
`;
