import React from "react";
import classNames from "classnames";
import "./style.scss";
import CallIcon from "assets/icons/call.svg";
import EditIcon from "assets/icons/edit.svg";
import ChatIcon from "assets/icons/chat.svg";
import CloseIcon from "assets/icons/close.svg";
import ArchiveIcon from "assets/icons/archive.svg";
import PlusIcon from "assets/icons/plus_green.svg";
import PlusGrayIcon from "assets/icons/plus_gray.svg";
import PostIcon from "assets/icons/post.svg";
import DownIcon from "assets/icons/arrow_down_green.svg";

interface Props {
  type:
    | "call"
    | "edit"
    | "chat"
    | "archive"
    | "plus"
    | "plus_gray"
    | "close"
    | "post"
    | "down";
  toolTip?: string;
  className?: string;
  size?: "normal" | "small" | "large";
  onClick?(): void;
}
export const IconButton = ({
  type,
  toolTip,
  className,
  size = "normal",
  onClick,
}: Props) => {
  return (
    <img
      className={classNames("icon-button-control", className, size)}
      data-tip={toolTip}
      onClick={onClick}
      src={
        type === "call"
          ? CallIcon
          : type === "edit"
          ? EditIcon
          : type === "archive"
          ? ArchiveIcon
          : type === "chat"
          ? ChatIcon
          : type === "plus"
          ? PlusIcon
          : type === "plus_gray"
          ? PlusGrayIcon
          : type === "close"
          ? CloseIcon
          : type === "post"
          ? PostIcon
          : type === "down"
          ? DownIcon
          : undefined
      }
      alt={toolTip}
    />
  );
};
