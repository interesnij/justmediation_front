import React from "react";
import { Router } from "@reach/router";
import { configure } from "axios-hooks";
import LRU from "lru-cache";
import Axios from "axios";
import { isMobile } from 'react-device-detect';
import { FirebaseAppProvider } from "reactfire";
import { FIREBASE_CONFIG } from "config";

import {
  LoginPage,
  SignupPage,
  MediatorRegisterPage,
  ClientRegisterPage,
  ParalegalRegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  EnterpriseRegisterPage,
  OnboardingProfilePage,
  OnboardingParalegalPage,
  OnboardingSubscriptionPage,
  NotFoundPage,
  EnterpriseOnboardingPage,
  EmailVerifiedPage,
  PolicyPage,
  TermsPage,
  UnsubscribePage,
  ComingSoon,
} from "pages";
import {
  MediatorRouter,
  ClientRouter,
  ParalegalRouter,
  EnterpriseRouter,
  OthersRouter,
} from "apps";
import {
  AuthProvider,
  BasicDataProvider,
  CommonUIProvider,
  MatterProvider,
  TimerProvider,
  SubscriptionAccessProvider
} from "contexts";
import thunkMiddleware from "redux-thunk";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { VoxeetProvider, reducer } from "@voxeet/react-components";
import "@voxeet/react-components/dist/voxeet-react-components.css";
import useDocumentTitle from "./hooks/useDocumentTitle";

const configureStore = () =>
  createStore(
    combineReducers({ voxeet: reducer }),
    applyMiddleware(thunkMiddleware)
  );

const axios = Axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/v1/`,
}); 
const cache = new LRU({ max: 10 });

configure({ axios, cache });

function App() {
  // update document title each page
  // to update every time, when change pathname
  useDocumentTitle()

  const path = window.location.pathname;
  const visibleOnMobile = [
    '/terms-of-use',
    '/privacy-policy',
    '/auth/email-unsubscribe',
    '/auth/email-verified',
    '/auth/forgot-password',
    '/auth/password-change-confirm'
  ];
  if (isMobile && visibleOnMobile.indexOf(path) === -1) {
    return <ComingSoon />
  }  

  return (
    <div className="App">
      <FirebaseAppProvider firebaseConfig={FIREBASE_CONFIG}>
        <AuthProvider>
          <BasicDataProvider>
            <SubscriptionAccessProvider>
              <CommonUIProvider>
                <MatterProvider>
                  <TimerProvider>
                    <VoxeetProvider store={configureStore()}>
                      <Router>
                        <LoginPage default path="/" />
                        <NotFoundPage path="/404" />
                        <PolicyPage path="/privacy-policy" />
                        <TermsPage path="/terms-of-use" />
                        <LoginPage path="/auth/login" />
                        <UnsubscribePage path="/auth/email-unsubscribe" />
                        <EmailVerifiedPage path="/auth/email-verified" />
                        <ForgotPasswordPage path="/auth/forgot-password" />
                        <ResetPasswordPage path="/auth/password-change-confirm" />
                        <SignupPage path="/auth/register" />
                        <ClientRegisterPage path="/auth/register/client" />
                        <MediatorRegisterPage path="/auth/register/mediator" />
                        <ParalegalRegisterPage path="/auth/register/paralegal" />
                        <EnterpriseRegisterPage path="/auth/register/enterprise" />
                        <OnboardingSubscriptionPage path="/auth/onboarding/subscription/mediator" />
                        <OnboardingProfilePage path="/auth/onboarding/profile/mediator" />
                        <OnboardingParalegalPage path="/auth/onboarding/paralegal" />
                        <EnterpriseOnboardingPage path="/auth/onboarding/enterprise" />
                        <MediatorRouter path="/mediator/*" />
                        <ClientRouter path="/client/*" />
                        <EnterpriseRouter path="/enterprise/*" />
                        <ParalegalRouter path="/paralegal/*" />
                        <OthersRouter path="/other/*" />
                      </Router>
                    </VoxeetProvider>
                  </TimerProvider>
                </MatterProvider>
              </CommonUIProvider>
            </SubscriptionAccessProvider>
          </BasicDataProvider>
        </AuthProvider>
      </FirebaseAppProvider>
    </div>
  );
}

export default App;
