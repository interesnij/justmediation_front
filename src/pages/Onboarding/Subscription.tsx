import React, { useState, useEffect } from "react";
import { RouteComponentProps, navigate } from "@reach/router";
import { useInput } from "hooks";
import { OnboardingLayout } from "layouts";
import { useAuthContext } from "contexts";
import { ChooseSubscription } from "./components/ChooseSubscription";
import { PaymentForm } from "./components/Payment";
import "./style.scss";

const texts = [
  {
    heading: "Choose the plan that’s right for you...",
    desc: "",
  },
  {
    heading: "Set up your payment",
    desc: "Access JustMediation dashboard as soon as you set up your payment.",
  },
];

export const OnboardingSubscriptionPage: React.FC<RouteComponentProps> = () => {
  const [step, setStep] = useState(0);
  const subscriptionType = useInput("");
  const [subscriptionData, setSubscriptionData] = useState({});
  const { isLogined } = useAuthContext();

  const handleBack = () => {
    if (step === 1) {
      setStep(0);
    }
  };
  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    }
  };

  useEffect(() => {
    if (!isLogined) {
      navigate("/");
    }
    return () => {};
  }, [isLogined]);

  return (
    <OnboardingLayout>
      <div className="onboarding-page">
        <div className="subscription-title">Subscription</div>
        <div className="onboarding-page__container mt-3">
          <div className="subscription-heading">{texts[step].heading}</div>
          <div className="subscription-desc mt-2 mb-4">{texts[step].desc}</div>
          {step === 0 ? (
            <ChooseSubscription
              {...subscriptionType}
              onNext={handleNext}
              onChangeSubscription={(e) => setSubscriptionData(e)}
            />
          ) : step === 1 ? (
            <PaymentForm
              subscriptionData={subscriptionData}
              planId={subscriptionType.value}
              onBack={handleBack}
            />
          ) : null}
        </div>
      </div>
    </OnboardingLayout>
  );
};
