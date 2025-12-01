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
    title: "Mediator / Arbitrator",
    features: [
      "Full-service platform to run the entire mediation or arbitration process",
      "Patented AI-driven researh tools to prepare, analyted and structure matters",
      "Secure professional environment for mamaging parties, documents; and outcomes",
    ],
    route: "/auth/register/mediator",
  },
  {
    label: "We are a",
    title: "Law Firm",
    features: [
      "End-to-end solution for your practice and your clients",
      "AI-driven researh and structured workflows to support mediation andiibror-matters",
      "Exceptional, uniform service for all clients - no tiered limititions", 
    ],
    route: "/auth/register/enterprise",
  },
  {
    label: "I am an",
    title: "Attorney",
    features: [
      "A trusted environment where you and your clients feel fully supported",
      "Purpose-build platform that incorporates mediation and arbitration workflows",
      "Patented AI-driven researh tools to enhanse case preparation and streamline dispute resolution",
    ],
    route: "/auth/register/mediator",
  },
  {
    label: "We are a",
    title: "Corporate",
    features: [
      "Invite your prefered mediator or arbitrator to conduct internal or external dispute resolution",
      "Secure, compilant environment failiored for organizational conflict management",
      "AI supported insight and structured workflows to ensure clarity, consistency, and officietn outcomes", 
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
      <div className="d-flex">
      {accountData.map((account, index) => (
        <Account {...account} key={`${index}key`} />
      ))}
      </div>
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
