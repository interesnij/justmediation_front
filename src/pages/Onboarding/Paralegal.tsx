/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { OnboardingLayout } from "layouts";
import { RouteComponentProps, navigate } from "@reach/router";
import { ParalegalOnboardingDto } from "types";
import { useAuthContext } from "contexts";

import {
  ProfileForm1,
  ProfileForm2,
  ProfileForm3,
  Paralegal3,
} from "./components";

import "./style.scss";
const titleData = [
  "Personal Information",
  "Experience and Practice",
  "Service and Pricing",
];
export const OnboardingParalegalPage: React.FC<RouteComponentProps> = () => {
  const [step, setStep] = useState(1);
  const { isLogined, userEmail, profile: data } = useAuthContext();

  const [profile, setProfile] = useState<ParalegalOnboardingDto>({
    first_name: data?.first_name || "",
    last_name: data?.last_name || "",
    middle_name: data?.middle_name || "",
    email: userEmail || "",
    phone: data?.phone || "",
    biography: "",
    years_of_experience: "",
    education: [
      {
        university: "",
        year: 0,
      },
    ],
    practice_jurisdictions: data?.practice_jurisdictions || [
      {
        country: 0,
        state: 0,
        number: "",
        year: 0,
      },
    ],
    specialities: [],
    fee_types: [],
    payment_type: [],
    fee_rate: 0,
    fee_currency: 1,
    spoken_language: [],
    tax_rate: ""
  });

  useEffect(() => {
    if (data) {
      setProfile({
        ...profile,
        first_name: data?.first_name,
        last_name: data?.last_name,
        middle_name: data?.middle_name,
        phone: data?.phone,
        practice_jurisdictions: data?.practice_jurisdictions,
      });
    }
    return () => {};
  }, [data]);

  const handleNext = (params: ParalegalOnboardingDto) => {
    if (step < 3) {
      setProfile({ ...profile, ...params });
      setStep((state) => state + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((state) => state - 1);
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
        <div className="onboarding-page__container mt-4 d-flex flex-column">
          <div className="subscription-title">Welcome to JustMediation</div>
          <div className="text-gray text-center">
            Set up your profile so clients can easily find you
          </div>
          <div className="mt-4 text-gray text-center">Step {step} of 3</div>
          <div className="subscription-heading mb-4">{titleData[step - 1]}</div>
          {step === 1 ? (
            <ProfileForm1 initData={profile} onNext={handleNext} />
          ) : step === 2 ? (
            <ProfileForm3
              initData={profile}
              onBack={handleBack}
              onNext={handleNext}
            />
          ) : step === 3 ? (
            <Paralegal3 initData={profile} onBack={handleBack} />
          ) : null}
        </div>
      </div>
    </OnboardingLayout>
  );
};
