import React from "react";
import { User, Tag } from "components";
import { format } from "date-fns";
import { navigate } from "@reach/router";
import { renderBudget, renderProposalRate } from "helpers"; 

export const ActivePost = ({ item, userType }) => {
  const post = item ? item.post_data : {};
  const client = post?.client_data || {};
  return (
    <div className="active-engagement" onClick={e => navigate(`/${userType}/engagement/submitted_post/${post.id}`)}> {/* // NEED replace post.id with item?.id when `/business/proposals/{id}` will have post id */}
      <div className="post-item">
        <div className="d-flex mt-1">
          <User 
            size="small" 
            className="my-auto" 
            alt={`${client?.first_name} ${client?.last_name}`}
            avatar={client?.avatar} 
          />
          <div className="ml-1">
            <div className="post-item__title text-ellipsis">{post?.title}</div>
            <div className="post-item__author">
              {client?.first_name} {client?.last_name}
              <div className="post-item__date">
                {post?.created
                  ? format(new Date(post?.created), "MM/dd/yy")
                  : ""}
              </div>
            </div>
          </div>
        </div>
        {!!post?.practice_area_data && (
          <Tag type="custom" isCustomContent={true} className="mt-1">
            {post.practice_area_data?.title}
          </Tag>
        )}
        {post?.budget_min && (
          <div className="post-item__budget mt-1">
            <span className="mr-05">Budget:</span>
            {renderBudget(post)}
          </div>
        )}
        <div className="post-item__content mt-1">
          {post?.description}
        </div>
      </div>
      <div className="proposal-details">
        {item?.rate && (
          <div className="text-dark proposal-rate">
            Your proposal: <span className="price ml-1">{renderProposalRate(item)}</span>
          </div>
        )}
        <div className="text-gray mt-1">
          {item?.created
            ? 'Submitted ' + format(new Date(item?.created), "MM/dd/yy")
            : ""}
        </div>
      </div>
    </div>
  );
};
