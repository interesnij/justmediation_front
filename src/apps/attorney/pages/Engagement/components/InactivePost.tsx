import React from "react";
import { User, Button } from "components";
import { formatDistanceToNow, format } from "date-fns";
import { Link } from "@reach/router";
import { useModal } from "hooks";
import { DeleteProposal } from "modals";
import { renderProposalRate } from "helpers";

export const InactivePost = ({ item, refetch, userType }) => {
  const deleteModal = useModal();
  const post = item?.post_data || {};
  const client = post?.client_data || {};

  const onDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteModal.setOpen(true)
  }

  return (
    <div className="post-control">
      <Link to={`/${userType}/engagement/submitted_post/${post.id}`}>
        <div className="justify-content-between">
          <div>
            <div className="d-flex">
              <div className="post-control__title">
                {post?.title}
              </div>
              <div className="practice ml-3 my-auto">{post?.practice_area_data?.title}</div>
            </div>
            <div className="d-flex mt-1">
              <User 
                size="small" 
                className="my-auto" 
                alt={"authorName"}
                avatar={client?.avatar} 
              />
              <div className="ml-1">
                <div className="post-control__author">
                  {`${client?.first_name} ${client?.last_name}`}
                </div>
                {!!post?.created && (
                  <div className="post-control__post-date">
                    Posted {formatDistanceToNow(new Date(post.created))} ago
                  </div>
                )}
              </div>
            </div>
            <div className="post-control__content">
              {item?.description}
            </div>
          </div>
          <div style={{ minWidth: 180, marginLeft: 40 }}>
            <div className="proposal">
              <span className="proposal-label">Your proposal:</span>
              <span className="price">
                {renderProposalRate(item)}
              </span>
            </div>
            <div
              className="text-gray ml-auto mt-1 text-right"
              style={{ fontSize: 12 }}
            >
              <span className="capitalize">{item?.status}</span>
              {item?.status_modified 
                ? ` on ${format(new Date(item.status_modified), "MM/dd/yy")}` 
                : ''
              }
            </div>
            <Button 
              type="outline" 
              className="mt-3" 
              widthFluid 
              theme="seafoam"
              onClick={onDeleteClick}
            >
              Delete
            </Button>
          </div>
        </div>
      </Link>
      {
        deleteModal?.open &&
        <DeleteProposal 
          {...deleteModal} 
          proposal={item}
          callback={refetch} 
        />
      }
    </div>
  );
};
