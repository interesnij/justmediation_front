import React, { useState } from "react";
import {RouteComponentProps, navigate} from "@reach/router";
import { CreateAccountPage } from "./CreateAccount";
import { VerificationForm } from "./VerificationForm";
import { MediatorRegisterDto } from "types";

import "./../style.scss";

export const MediatorRegisterPage: React.FC<RouteComponentProps> = () => {
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState<MediatorRegisterDto>({
    email: "",
    password1: "",
    password2: "",
    first_name: "",
    last_name: "",
    phone: "",
    is_disciplined: false,
    practice_jurisdictions: [{ country: "", state: "", number: "", year: 0 }],
    registration_attachments: [],
  });

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate(-1);
    }
  };

  const handleSubmitCreateAccount = (values) => {
    setUserInfo((state) => ({ ...state, ...values }));
    setStep(2);
  };

  return (
    <div className="signup-page">
      {step === 1 ? (
        <CreateAccountPage
          onNext={handleSubmitCreateAccount}
          initData={userInfo}
        />
      ) : (
        <VerificationForm onBack={handleBack} initData={userInfo} />
      )}
    </div>
  );
};
