import React, { useState } from "react";
import {RouteComponentProps, navigate} from "@reach/router";
import { CreateAccountPage } from "./CreateAccount";
import { ChooseType } from "./ChooseType";
import { VerificationForm } from "./VerificationForm";
import { OtherForm } from "./Other";
import { ParalegalRegisterDto } from "types";

export const ParalegalRegisterPage: React.FC<RouteComponentProps> = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [userInfo, setUserInfo] = useState<ParalegalRegisterDto>({
    email: "",
    password1: "",
    password2: "",
    first_name: "",
    last_name: "",
    phone: "",
    is_disciplined: false,
    role: "",
    avatar: "",
    practice_jurisdictions: [{ country: "", state: "", number: "", year: 0 }],
    registration_attachments: [],
  });

  const handleNext = (values: ParalegalRegisterDto) => {
    if (step === 1) {
      setUserInfo((state) => ({ ...state, ...values }));
      setStep(2);
    }
  };
  const handleSetUserType = (params: string) => {
    setUserType(params);
    setStep(3);
  };
  const handleBack = () => {
    if (step > 1) {
      setStep((state) => state - 1);
    } else {
      navigate(-1);
    }
  };

  return (
    <div>
      {step === 1 ? (
        <CreateAccountPage onNext={handleNext} initData={userInfo} />
      ) : step === 2 ? (
        <ChooseType onNext={handleSetUserType} onBack={handleBack} />
      ) : step === 3 && userType === "paralegal" ? (
        <VerificationForm onBack={handleBack} initData={userInfo} />
      ) : step === 3 && userType === "other" ? (
        <OtherForm onBack={handleBack} initData={userInfo} />
      ) : null}
    </div>
  );
};
