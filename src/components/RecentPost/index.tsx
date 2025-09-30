import React from "react";
import { User } from "components";
import { format } from "date-fns";
import { useAuthContext } from "contexts";
import CommentsIcon from "assets/icons/comments.svg";
import FollowersIcon from "assets/icons/followers.svg";
import { Link } from "@reach/router";
import styled from "styled-components";
import { getUserName } from "helpers";
import "./style.scss";

export const RecentPost = (post) => {
  const { userType } = useAuthContext();
  return (
    <div className="recent-post">
      <Link to={`/${userType}/forums/post/${post.id}`}>
        <div className="d-flex">
          <User avatar={post?.author?.avatar} alt={getUserName(post?.author)} />
          <div className="ml-1 flex-2">
            <div className="recent-post__title">{post?.title}</div>
            <div className="d-flex w-100">
              <div className="recent-post__author">
                Posted by{" "}
                {`${post?.author?.first_name} ${post?.author?.last_name}`}
              </div>
              {post?.created && (
                <div className="recent-post__post-date">
                  {format(new Date(post?.created), "MMM dd,yyyy")}
                </div>
              )}
            </div>
          </div>
        </div>
        <PracticeArea className="mt-1">{post?.topic_data?.title}</PracticeArea>
        <div className="recent-post__content">{post?.message}</div>
        <div className="d-flex mt-auto">
          <div className="recent-post__feature">
            <img src={CommentsIcon} alt="comments" />
            <span>{post?.comment_count}</span>
          </div>
          <div className="recent-post__feature">
            <img src={FollowersIcon} alt="followers" />
            <span>{post?.followers_count}</span>
          </div>
          {post?.modified && (
            <span className="recent-post__post-date ml-auto mr-0">
              Last Reply -{" "}
              {post?.last_comment?.created
                ? format(
                    new Date(post?.last_comment?.created),
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

const PracticeArea = styled.div`
  border: 1px solid #e0e0e1;
  border-radius: 4px;
  color: #333;
  padding: 0 12px;
  font-size: 12px;
  height: fit-content;
  line-height: 24px;
  width: fit-content;
`;
