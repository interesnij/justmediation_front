import React from "react";
import { RouteComponentProps } from "@reach/router";
import { CreateAccountLayout } from "layouts";
import ArrowImg from "assets/icons/arrow-right-green.svg";
import "./style.scss";

interface AccountProps {
  label?: string;
  title: string;
  features: string[];
  route: string;
}
const accountData: AccountProps[] = [
  {
    label: "I am an",
    title: "Mediator",
    features: [
      "Powerful and user-friendly tools for lead generation, lead management and conversion",
      "Open forum where legal professionals answer people’s questions about the law",
      "Constant, secure mediator/client communication on open matters",
    ],
    route: "/auth/register/mediator",
  },
  {
    title: "Law Firm",
    features: [
      "No hidden fees – every JustMediationHub feature included",
      "Safe & secure – only platform with patented blockchain technology",
      "End-to-end solution – only platform to provide an end-to-end solution for you & your clients",
      "Exceptional service for all – no tier-based service",
    ],
    route: "/auth/register/enterprise",
  },
];

export const SignupPage: React.FC<RouteComponentProps> = () => {
  return (
    <CreateAccountLayout
      title="JustMediationHub"
      label="Sign Up with"
      desc="A legal practice management system for lawyers, paralegals and law firms who want an end-to-end solution that is easy to use and enhances their practice."
      feature="Features"
      features={[
        "A means to grow your book and your practice",
      ]}
    >
      <div className="signup-page-account-type">Select Your Account Type</div>
      {accountData.map((account, index) => (
        <Account {...account} key={`${index}key`} />
      ))}
    </CreateAccountLayout>
  );
};

const Account = ({ label, title, features, route }: AccountProps) => (
  <a href={route} className="signup-page-account">
    <div className="signup-page-account__label">{label}</div>
    <div className="signup-page-account__title">{title}</div>

    <img src={ArrowImg} alt="arrow" className="signup-page-account__arrow" />

    <ul className="signup-page-account__content">
      {features.map((feature, index) => (
        <li key={`${index}key`}>{feature}</li>
      ))}
    </ul>
  </a>
);
