import React from "react";
import "./style.scss";

interface Props {
  children: React.ReactNode;
}

export const SignupBar = ({ children }: Props) => {
  return <div className="signup-bar">{children}</div>;
};
