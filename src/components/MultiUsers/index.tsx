import React from "react";
import classNames from "classnames";
import { User } from "components";
import { Link } from "@reach/router";
import "./style.scss";
interface Props {
  size?: "normal" | "small" | "large";
  className?: string;
  onClick?(): void;
  data?: any[];
  userType?: string;
}
export const MultiUsers = ({
  className,
  data = [],
  onClick,
  userType = "client"
}: Props) => {
  return data.length > 0 ? (
    <div className={classNames("multi-avatar", className)} onClick={onClick}>
      {data.slice(0, 3).map((data, index) => {
        const profileLink = userType === 'client'
          ? (data?.user_type === 'mediator' ? `/client/find/mediators/${data?.id}` : `/client/find/paralegals/${data?.id}`)
          : data?.user_type === 'client' ? `/${userType}/leads/${data?.id}?type=${data?.user_type}` : `/${userType}/contacts/${data?.id}`;
        return (
          <div className="multi-avatar__icon" key={`${index}key`}>
            {
              !onClick?
              <Link to={profileLink}>
                <User avatar={data?.avatar} />
              </Link>
              :
              <User avatar={data?.avatar} />
            }
          </div>
      )})}
      {data.length > 3 && (
        <span className="text-dark my-auto">+{data.length - 3}</span>
      )}
    </div>
  ) : null;
};
