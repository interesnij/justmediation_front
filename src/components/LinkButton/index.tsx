import React from "react";
import classNames from "classnames";
import { navigate } from "@reach/router";
import ArrowImg from "assets/icons/arrow-left-green.svg";
import "./style.scss";

interface Props {
  children: React.ReactNode;
  to?: string;
  className?: string;
  onClick?(): void;
  type?: "back" | "";
}

export const LinkButton = ({
  className,
  children,
  to,
  onClick = () => {},
  type = "back",
}: Props) => {
  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      onClick();
    }
  };
  return (
    <div className={classNames("link-button", className)} onClick={handleClick}>
      {type === "back" ? <img src={ArrowImg} alt="icon" /> : null}
      {children}
    </div>
  );
};
