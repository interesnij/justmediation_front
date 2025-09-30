import React from "react";
import classNames from "classnames";
import "./style.scss";

interface Props {
  children: React.ReactNode;
  className?: string;
  count?: number | string;
}

export const Badge = ({ children, className, count }: Props) => {
  return (
    <div className={classNames("badge-control", className)}>
      {children}
      {count ? <span className="badge-control__count">{count}</span> : null}
    </div>
  );
};
