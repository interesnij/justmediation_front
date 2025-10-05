import React from "react";
import { User, Tag } from "components";
import { format } from "date-fns";
import { useAuthContext } from "contexts";
import { Link } from "@reach/router";
import { renderBudget, renderProposalRate } from "helpers";

export const Post = ({ post, userType }) => {
  const { profile } = useAuthContext();

  const proposal = post?.proposals?.length 
    ? post.proposals.find(p => p?.mediator_data?.id === profile.id)
    : {};

  const linkUrl = proposal && Object.keys(proposal).length 
    ? `/${userType}/engagement/submitted_post/${post?.id}`
    : `/${userType}/engagement/post/${post?.id}`;

  return (
    <div className="post-item">
      <Link to={linkUrl}>
        <div className="justify-content-between">
        <div>
          <div className="d-flex mt-1">
            <User
              size="small"
              avatar={post?.client_data?.avatar}
              className="my-auto"
            />
            <div className="ml-1">
              <div className="post-item__title text-ellipsis">{post?.title}</div>
              <div className="post-item__author">
                {post?.client_data?.first_name} {post?.client_data?.last_name}
                <div className="post-item__date">
                  {post?.created
                    ? format(new Date(post?.created), "MM/dd/yy")
                    : ""}
                </div>
              </div>
            </div>
          </div>
          {post?.practice_area_data && (
            <Tag type="custom" isCustomContent={true} className="mt-1">
              {post?.practice_area_data?.title}
            </Tag>
          )}
          {post?.budget_min && (
            <div className="post-item__budget mt-1">
              <span className="mr-05">Budget:</span>
              {renderBudget(post)}
            </div>
          )}
          <div className="post-item__content mt-1 pre-wrap">
            {post?.description}
          </div>
        </div>
        {post?.withProposal && proposal && (
          <div className="proposal-details">
            {proposal?.rate && (
              <div className="text-dark proposal-rate">
                Your proposal: <span className="price ml-1">{renderProposalRate(proposal)}</span>
              </div>
            )}
            <div className="text-gray mt-1">
              {proposal?.created
                ? 'Submitted ' + format(new Date(proposal?.created), "MM/dd/yy")
                : ""}
            </div>
          </div>
        )}
        </div>
      </Link>
    </div>
  );
};
