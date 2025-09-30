import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { CreateAccountPage } from "./CreateAccount";
import { VerificationForm } from "./VerificationForm";
import { EnterpriseRegisterDto } from "types";
import "./../style.scss";

export const EnterpriseRegisterPage: React.FC<RouteComponentProps> = () => {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState<EnterpriseRegisterDto>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    role: "",
    firm_size: "",
    password1: "",
    password2: "",
  });
  const handleBack = () => {
    setStep(1);
  };

  const handleSubmitCreateAccount = (values) => {
    setInfo((state) => ({ ...state, ...values }));
    setStep(2);
  };

  const init = async () => {};
  useEffect(() => {
    init();
    return () => {};
  }, []);
  return (
    <div className="signup-page">
      {step === 1 ? (
        <CreateAccountPage onNext={handleSubmitCreateAccount} initData={info} />
      ) : (
        <VerificationForm onBack={handleBack} initData={info} />
      )}
    </div>
  );
};
