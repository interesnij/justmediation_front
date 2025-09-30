import React from "react";
import { Link, navigate } from "@reach/router";
import LogoImg from "assets/images/logo.svg";

import "./style.scss";
interface Props {
  children: React.ReactNode;
}

export const LoginLayout = ({ children }: Props) => {
  const handleClickLogin = () => {
    navigate("/");
  };

  return (
    <div className="login-page">
      <img
        src={LogoImg}
        alt="logo"
        className="login-page__logo"
        onClick={handleClickLogin}
      />

      {children}
      <div className="login-page__footer mb-3">
        <span className="mr-1">Don't have an account?</span>
        <Link to="/auth/register">Sign up here</Link>
      </div>
    </div>
  );
};
