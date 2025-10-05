/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { OnboardingLayout } from "layouts";
import { RouteComponentProps, navigate } from "@reach/router";
import { MediatorRegisterDto } from "types";
import { useAuthContext } from "contexts";

import {
  ProfileForm1,
  ProfileForm2,
  ProfileForm3,
  ProfileForm4,
} from "./components";

import "./style.scss";
const titleData = [
  "Personal Information",
  "Law Firm Information",
  "Experience and Practice",
  "Service and Pricing",
];
interface LocationStateProps {
  team_logo?: string;
  team_members?: {
    email?: string;
    type?: string;
  }[];
  firm_name?: string;
  team_members_registered?: number[];
}

export const OnboardingProfilePage: React.FC<RouteComponentProps> = ({
  location,
}) => {
  const [step, setStep] = useState(1);
  const { isLogined, userEmail, profile: initData } = useAuthContext();

  const data = initData.role ? initData.admin_user_data : initData;
  const state = location?.state as LocationStateProps;
  const [profile, setProfile] = useState<MediatorRegisterDto>({
    first_name: data?.first_name || "",
    last_name: data?.last_name || "",
    middle_name: data?.middle_name || "", 
    email: userEmail || "",
    phone: data?.phone || "",
    biography: "",
    firm_name: state?.firm_name || "",
    website: "https://",
    years_of_experience: "",
    team_logo: state?.team_logo || "",
    team_members_registered: state?.team_members_registered || [],
    team_members: state?.team_members || [],
    firm_locations: [
      {
        country: "",
        state: "",
        address: "",
        city: "",
        zip_code: "",
      },
    ],
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
    appointment_type: [],
    fee_types: [],
    payment_type: [],
    fee_rate: 0,
    fee_currency: 1,
    spoken_language: [],
    is_submittable_potential: true,
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

  const handleNext = (params: MediatorRegisterDto) => {
    if (step < 4) {
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
          <div className="subscription-title">Welcome to JustMediationHub</div>
          <div className="text-gray text-center">
            Set up your profile so clients can easily find you
          </div>
          <div className="mt-4 text-gray text-center">Step {step} of 4</div>
          <div className="subscription-heading mb-4">{titleData[step - 1]}</div>
          {step === 1 ? (
            <ProfileForm1 initData={profile} onNext={handleNext} role={initData.role} />
          ) : step === 2 ? (
            <ProfileForm2
              initData={profile}
              onBack={handleBack}
              onNext={handleNext}
            />
          ) : step === 3 ? (
            <ProfileForm3
              initData={profile}
              onBack={handleBack}
              onNext={handleNext}
            />
          ) : step === 4 ? (
            <ProfileForm4 initData={profile} onBack={handleBack} />
          ) : null}
        </div>
      </div>
    </OnboardingLayout>
  );
};
