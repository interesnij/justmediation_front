import React from "react";
import classNames from "classnames";
import { User } from "components";
import StarFillIcon from "assets/icons/star_fill.svg";
import "./../style.scss";
interface Props {
  className?: string;
}
export const ChatItem = ({ className }: Props) => {
  return (
    <div className={classNames("chat-item", className)}>
      <User />
      <div className="ml-1">
        <div className="d-flex">
          <div className="text-black">Ben Johnson</div>
          <img src={StarFillIcon} alt="star" className="chat-item__star ml-1" />
        </div>
        <div className="d-flex">
          <div className="chat-item__message text-gray">
            What time did you go to work?
          </div>
          <div className="text-gray ml-auto">12:08 PM</div>
        </div>
      </div>
    </div>
  );
};
