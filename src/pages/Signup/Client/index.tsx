import React, { useState } from "react";
import { RouteComponentProps, navigate } from "@reach/router";
import { ClientRegisterDto } from "types";
import { AdditionalInfoPage } from "./AdditionalInfo";
import { CreateAccountPage } from "./CreateAccount";
import "./../style.scss";

export const ClientRegisterPage: React.FC<RouteComponentProps> = () => {

  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState<ClientRegisterDto>({
    email: "",
    password1: "",
    password2: "",
    first_name: "",
    last_name: "",
    phone: "",
    country: 0,
    state: 0,
    city: "",
    address1: "",
    address2: "",
    zip_code: "",
    specialities: [],
    organization_name: "",
    job: "",
    client_type: "individual",
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
    <div>
      {step === 1 ? (
        <CreateAccountPage
          onNext={handleSubmitCreateAccount}
          initData={userInfo}
        />
      ) : (
        <AdditionalInfoPage onBack={handleBack} initData={userInfo} />
      )}
    </div>
  );
};
