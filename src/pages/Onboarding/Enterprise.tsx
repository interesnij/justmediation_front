import React, { useState, useEffect } from "react";
import { OnboardingLayout } from "layouts";
import { RouteComponentProps, navigate } from "@reach/router";
import { EnterpriseOnboardingDto } from "types";
import { useAuthContext, useCommonUIContext } from "contexts";
import { TeamSettings, PersonalProfile } from "./enterpriseFragments";

import "./style.scss";
const titleData = ["Team Settings", "Personal Profile"];
export const EnterpriseOnboardingPage: React.FC<RouteComponentProps> = () => {
  const [step, setStep] = useState(0);
  const { isLogined, userEmail } = useAuthContext();
  const { showErrorModal } = useCommonUIContext();
  const { profile: data } = useAuthContext();
  const [profile, setProfile] = useState<EnterpriseOnboardingDto>({
    first_name: data?.admin_user_data?.first_name || "",
    last_name: data?.admin_user_data?.last_name || "",
    middle_name: data?.admin_user_data?.middle_name || "",
    email: userEmail,
    phone: data?.admin_user_data?.phone || "",
    avatar: data?.admin_user_data?.avatar || "",
    role: "",
    firm_name: "",
    team_logo: "",
    firm_locations: [],
    team_members: [],
  });

  const handleNext = async (params: EnterpriseOnboardingDto) => {
    if (data.role === "Attorney") {
      try {
        navigate("/auth/onboarding/profile/attorney", { state: params });
      } catch (error: any) {
        showErrorModal("Error", error);
      }
    }
    else {
      setProfile({ ...profile, ...params });
      setStep((step) => step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((step) => step - 1);
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
          <div className="subscription-title">Welcome to JustLaw</div>
          {data.role !== "Attorney" && <div className="mt-4 text-gray text-center">Step {step + 1} of 2</div>}
          <div className="subscription-heading mt-1 mb-4">
            {titleData[step]}
          </div>
          {step === 0 ? (
            <TeamSettings initData={profile} onNext={handleNext} />
          ) : step === 1 ? (
            <PersonalProfile
              initData={profile}
              onBack={handleBack}
            />
          ) : null}
        </div>
      </div>
    </OnboardingLayout>
  );
};
