import React, { useState } from "react";
import { navigate } from "@reach/router";
import { useInput } from "hooks";
import { ChooseSubscription } from "./ChooseSubscription";
import { PaymentForm } from "./Payment";
import { FullScreenModal } from "components";
import "./style.scss";

const texts = [
  {
    heading: "Choose the plan that’s right for you!",
    desc: "",
  },
  {
    heading: "Payment details",
    desc: "Finish your order by completing your payment information below.",
  },
];

interface iProps {
  open: boolean;
  setOpen: (arg: boolean) => void;
}
export const SubscriptionAdd: React.FC<iProps> = ({
  open,
  setOpen
                                                                          }) => {
  const [step, setStep] = useState(0);
  const subscriptionType = useInput("");
  const [subscriptionData, setSubscriptionData] = useState({});

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

  return (
    <FullScreenModal title=""
                     open={open} setOpen={setOpen}>
      <div className="onboarding-page">
        <div className="subscription-title mt-4">Subscription</div>
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
              closeModal={() => setOpen(false)}
            />
          ) : null}
        </div>
      </div>
    </FullScreenModal>
  );
};
