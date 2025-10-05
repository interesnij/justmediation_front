import React from "react";
import classNames from "classnames";
import { User } from "components";
import { format } from "date-fns";
import FavoriteIcon from "assets/icons/star_fill.svg";
import UnFavoriteIcon from "assets/icons/star_empty.svg";
import { renderLastMessageText } from "helpers";
import "./../style.scss";
interface Props {
  className?: string;
  data?: any;
}
export const ChatItem = ({ className, data }: Props) => {
  const client = data?.participants_data?.find(person => person.user_type === 'client');
  const renderTime = (data) => {
    const time = data?.last_message?.created;
    if (!time) return "";
    const timeString = typeof time === 'string'
      ? time
      : time.toDate()
    return format(new Date(timeString), "hh:mm:ss a");
  }
  return (
    <div className={classNames("chat-item", className)}>
      <User avatar={client?.avatar} />
      <div className="ml-1 w-100" style={data?.unread ? {fontWeight: 600} : {}}>
        <div className="d-flex">
          <div className="text-black">{client?.first_name} {client?.last_name}</div>
          <img 
            src={data?.is_favorite ? FavoriteIcon : UnFavoriteIcon} 
            alt="star" 
            className="chat-item__star ml-1" 
          />
        </div>
        <div className="justify-content-between">
          <div className="chat-item__message text-gray">
            {renderLastMessageText(data?.last_message)}
          </div>
          <div className="text-gray">
            {renderTime(data)}
          </div>
        </div>
      </div>
    </div>
  );
};
