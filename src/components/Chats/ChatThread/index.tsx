import React from "react";
import classNames from "classnames";
import { ChatThreadAvatar } from "components";
import { useAuthContext } from "contexts";
import { format } from "date-fns";
import FavoriteIcon from "assets/icons/star_fill.svg";
import UnFavoriteIcon from "assets/icons/star_empty.svg";
import { renderLastMessageText } from "helpers";

export const ChatThread = ({
  title,
  is_favorite,
  participants_data,
  active,
  onClick,
  onStarClick,
  last_message,
  unread
}) => {
  const { userId } = useAuthContext();

  const clickStar = (e) => {
    e.stopPropagation();
    onStarClick();
  }

  const renderTime = (time) => {
    if (!time) return "";
    const timeString = typeof time === 'string'
      ? time
      : time.toDate()
    return format(new Date(timeString), "hh:mm:ss a");
  }

  return (
    <div
      className={classNames("chat-sidebar__thread", { active, hasUnread: !!unread })}
      onClick={onClick}
    >
      <div className="chat-sidebar__thread-avatar">
        <ChatThreadAvatar
          data={participants_data
            .filter((item) => +item.id !== +userId)
            .map((item) => item.avatar)}
        />
      </div>
      <div className="w-100">
        <div className="mb-1 position-relative d-flex align-items-center">
          <div className="chat-sidebar__thread-name text-ellipsis">
            {title ||
              participants_data
                .filter((item) => +item.id !== +userId)
                .map(
                  (item) =>
                    `${item.first_name ?? ""} ${item.middle_name ?? ""} ${
                      item.last_name ?? ""
                    }`
                )
                .join(", ")}
          </div>
          <span className="chat-sidebar__thread-star" onClick={clickStar}>
            {is_favorite ? (
              <img src={FavoriteIcon} alt="favorite" />
            ) : (
              <img src={UnFavoriteIcon} alt="unfavorite" />
            )}
          </span>
        </div>
        <div className="d-flex">
          <span className="chat-sidebar__thread-text">{renderLastMessageText(last_message)}</span>
          <span className="chat-sidebar__thread-time ml-auto">
            {renderTime(last_message?.created)}
          </span>
        </div>
      </div>
    </div>
  );
};
