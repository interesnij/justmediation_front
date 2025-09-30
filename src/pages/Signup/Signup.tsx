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
    title: "Attorney",
    features: [
      "Powerful and user-friendly tools for lead generation, lead management and conversion",
      "Open forum where legal professionals answer people’s questions about the law",
      "Constant, secure attorney/client communication on open matters",
    ],
    route: "/auth/register/attorney",
  },
  {
    label: "I am a",
    title: "Paralegal/Other",
    features: [
      "For paralegals, assistants, associates, and any other matter related role",
      "Work efficiently and collaboratively with attorneys directly on matters",
      "Help attorneys manage their practice using lead generation, invoicing, time tracking, and document management",
    ],
    route: "/auth/register/paralegal",
  },
  {
    title: "Law Firm",
    features: [
      "No hidden fees – every JustLaw feature included",
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
      title="JustLaw"
      label="Sign Up with"
      desc="A legal practice management system for lawyers, paralegals and law firms who want an end-to-end solution that is easy to use and enhances their practice."
      feature="Features"
      features={[
        "Practice management made easy",
        "An end-to-end practice solution",
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
