import React from "react";
import { User } from "components";
import { formatDistanceToNow } from "date-fns";
import { getUserName } from "helpers";
import "./style.scss";

export const Reply = ({ children = null, data, onReply = (params) => {} }) => {
  return (
    <div className="reply-control">
      <div className="flex-column mt-1">
        <User
          avatar={data?.author?.avatar}
          alt={getUserName(data?.author)}
          className="mb-1"
        />
        <div className="line" />
      </div>
      <div className="reply-control__container">
        <div className="reply-control__name">{getUserName(data?.author)}</div>
        <div className="reply-control__date">
          {data?.created ? formatDistanceToNow(new Date(data?.created)) : ""}
        </div>
        <div className="d-flex">
          <div className="reply-control__message">{data?.text}</div>
          {/*
          <div
            className="reply-control__reply"
            onClick={() => onReply(data?.id)}
          >
            Reply
          </div>
        */}
        </div>
        {children && <div className="reply-control__content">{children}</div>}
      </div>
    </div>
  );
};
