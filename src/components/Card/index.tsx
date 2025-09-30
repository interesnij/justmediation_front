import React from "react";
import classNames from "classnames";
import "./style.scss";

interface Props {
  children: React.ReactNode;
  className?: string;
}
export const Card = ({ children, className }: Props) => {
  return (
    <div className={classNames("card-control", className)}>{children}</div>
  );
};
