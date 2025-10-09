import React from "react";
import { Link } from "@reach/router";
import { LinkButton } from "components";
import LogoImg from "assets/images/logo.svg";
import "./style.scss";

interface Props {
  children: React.ReactNode;
  label?: string;
  title: string;
  desc?: string;
  feature?: string;
  backRoute?: string;
  features?: string[];
}

export const CreateAccountLayout = ({
  children,
  label,
  title,
  desc,
  feature,
  backRoute,
  features = [],
}: Props) => {
  return (
    <div className="create-account-layout">
      <div className="create-account-layout__content">
        <div className="my-auto d-flex flex-column">{children}</div>
        <div className="login-page__footer mb-3">
          <span className="mr-1">Already have an account?</span>
          <Link to="/auth/login">Log in here</Link>
        </div>
      </div>
    </div>
  );
};
