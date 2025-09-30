import React from "react";
import { Link } from "@reach/router";
import LogoImg from "assets/images/logo.svg";
import "./style.scss";

interface Props {
  children: React.ReactNode;
}

export const SignupLayout = ({ children }: Props) => {
  return (
    <div className="signup-page-layout">
      <Link to="/">
        <img src={LogoImg} className="signup-page-layout__logo" alt="logo" />
      </Link>
      <div className="signup-page-layout__title">Sign Up with JustLaw</div>
      <div className="signup-page-layout__form">{children}</div>
    </div>
  );
};
