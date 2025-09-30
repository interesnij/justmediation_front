import React from "react";
import classNames from "classnames";
import { Link } from "@reach/router";
import "./style.scss";

interface Props {
  data: {
    tab: string;
    badge?: number;
    path?: string;
  }[];
  value: string;
  className?: string;
  onChange?(tab: string): void;
}
export const Tab = ({ data, className, value, onChange = () => {} }: Props) => {
  return (
    <div className={classNames("tab-control", className)}>
      {data.map(({ tab, badge, path }) => {
        return path ? (
          <Link to={path || "#"} key={tab} onClick={() => onChange(tab)}>
            <div
              className={classNames("tab-control__item", {
                "tab-control__item--active": tab === value,
              })}
            >
              <span>{tab}</span>
              {badge ? <span className="badge">{badge}</span> : null}
            </div>
          </Link>
        ) : (
          <div
            className={classNames("tab-control__item", {
              "tab-control__item--active": tab === value,
            })}
            onClick={() => onChange(tab)}
            key={tab}
          >
            <span>{tab}</span>
            {badge ? <span className="badge">{badge}</span> : null}
          </div>
        );
      })}
    </div>
  );
};
