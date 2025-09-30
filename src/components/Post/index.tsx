import React from "react";
import { User } from "components";
import { format, formatDistanceToNow } from "date-fns";
import { useAuthContext } from "contexts";
import CommentsIcon from "assets/icons/comments.svg";
// import DollarIcon from "assets/icons/dollar.svg";
import FollowersIcon from "assets/icons/followers.svg";
import { Link } from "@reach/router";
import { getUserName } from "helpers";
import "./style.scss";

export const Post = (post) => {
  const { userType } = useAuthContext();

  return (
    <div className="post-control">
      <Link to={post?.isMyPost? `/${userType}/forums/my-posts/${post?.id}` : `/${userType}/forums/post/${post?.id}`}>
        <div className="post-control__title text-ellipsis">{post?.title}</div>
        <div className="d-flex mt-1">
          <User
            size="small"
            avatar={post?.author?.avatar}
            alt={getUserName(post?.author)}
            className="my-auto"
          />
          <div className="ml-1">
            <div className="post-control__author">{`${post?.author?.first_name} ${post?.author?.last_name}`}</div>
            {post?.created && (
              <div className="post-control__post-date">
                Posted {formatDistanceToNow(new Date(post?.created))} ago
              </div>
            )}
          </div>
        </div>
        <div className="post-control__content">{post?.message}</div>
        <div className="d-flex">
          {/* <div className="post-control__feature">
            <img src={DollarIcon} alt="dollar" />
            <span>{replyCount}</span>
          </div> */}
          <div className="post-control__feature">
            <img src={CommentsIcon} alt="comment" />
            <span>{post?.comment_count}</span>
          </div>
          <div className="post-control__feature">
            <img src={FollowersIcon} alt="follower" />
            <span>{post?.followers_count}</span>
          </div>
          {post?.modified && (
            <span className="post-control__post-date ml-auto">
              Last Reply -{" "}
              {post?.last_comment_time
                ? format(
                    new Date(post?.last_comment_time),
                    "MMM dd, hh:mm:ss a"
                  )
                : ""}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};
