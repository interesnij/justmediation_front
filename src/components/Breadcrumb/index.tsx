import React from "react";
import ArrowRightIcon from "assets/icons/arrow_right.svg";
import { Link } from "@reach/router";
import classNames from "classnames";
import "./style.scss";

interface Props {
  previous: {
    label: string;
    url?: string;
  }[];
  current: string;
  className?: string;
}
export const Breadcrumb = ({ previous, current, className }: Props) => {
  return (
    <div className={classNames("breadcrumb-control", className)}>
      {previous.map(({ label, url }) => {
        return (
          <div className="breadcrumb-control__item" key={label}>
            <Link to={(url as string) ?? "#"} className="text-ellipsis">
              {label}
            </Link>
            <img src={ArrowRightIcon} className="my-auto" alt="arrow-right" />
          </div>
        );
      })}
      <div className="breadcrumb-control__item text-ellipsis d-block">
        {current}
      </div>
    </div>
  );
};
