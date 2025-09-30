import React from "react";
import { Link, navigate } from "@reach/router";
import classNames from "classnames";
import { useAuthContext } from "contexts";
import LogoImg from "assets/images/logo.svg";
import UsersImg from "assets/icons/users.svg";
import DropDownIcon from "assets/icons/profile_dropdown.svg";

import "./style.scss";

interface Props {
  children: React.ReactNode;
}

export const OnboardingLayout = ({ children }: Props) => {
  const { logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div className="onboarding-layout">
      <div className="onboarding-layout--header">
        <Link className="my-auto" to="/">
          <img src={LogoImg} alt="logo" className="onboarding-layout--logo" />
        </Link>
        <div
          tabIndex={0}
          className="onboarding-layout--account ml-auto my-auto"
        >
          <img
            src={UsersImg}
            alt="account"
            className="onboarding-layout--account-icon"
          />
          <img
            src={DropDownIcon}
            className={classNames("onboarding-layout--account-drop")}
            alt="drop-down"
          />

          <div
            className="onboarding-layout--account-content"
            onClick={handleLogout}
          >
            Log out
          </div>
        </div>
      </div>
      <div className="onboarding-layout--content">{children}</div>
    </div>
  );
};
