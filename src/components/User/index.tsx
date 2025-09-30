import React from "react";
import { FaUser } from "react-icons/fa";
import { Tag } from "components";
import classNames from "classnames";
import "./style.scss";
interface Props {
  className?: string;
  avatar?: string;
  alt?: string;
  size?: "normal" | "small" | "large" | "tiny";
  userName?: string;
  direction?: "toRight" | "toLeft";
  onClick?(params: any): void;
  tagName?:
    | "stage"
    | "open"
    | "closed"
    | "discovery"
    | "referred"
    | "referral-request"
    | "referral-pending"
    | "pending"
    | "attorney"
    | "paralegal"
    | "client"
    | "lead"
    | "overdue"
    | "date";
}
export const User = ({
  className,
  avatar,
  alt,
  size = "small",
  direction = "toRight",
  userName,
  tagName,
  onClick = () => {},
}: Props) => {
  return (
    <div
      className={classNames(
        "user-avatar-container",
        size,
        direction,
        className
      )}
      onClick={onClick}
    >
      <div className={classNames("user-avatar", size)} data-tip={alt}>
        {avatar ? <img src={avatar} alt={alt} /> : <FaUser />}
      </div>
      {userName && <div className="user-avatar__name">{userName}</div>}
      {tagName && <Tag type={tagName} className="my-auto ml-1" />}
    </div>
  );
};

interface Props2 {
  className?: string;
  avatar?: string;
  alt?: string;
  size?: "normal" | "small" | "large";
  userName?: string;
  onClick?(): void;
  desc?: string;
}
export const User2 = ({
  className,
  avatar,
  alt,
  size = "small",
  userName,
  desc,
  onClick = () => {},
}: Props2) => {
  return (
    <div
      className={classNames("user-avatar2-container", size, className)}
      onClick={onClick}
    >
      <div className={classNames("user-avatar2", size)} data-tip={alt}>
        {avatar ? <img src={avatar} alt={alt} /> : <FaUser />}
      </div>
      <div>
        {userName && <div className="user-avatar2__name">{userName}</div>}
        {desc && <div className="user-avatar2__desc">{desc}</div>}
      </div>
    </div>
  );
};
