import React from "react";
import { Tag, Button } from "components";
import { format } from "date-fns";
import { Link } from "@reach/router";
import ProposalIcon from "assets/images/proposal-icon.png";
import { renderBudget } from "helpers";

export const Post = ({ 
  post, 
  onDeletePost = (e, id:number) => {}, 
  onReactivate = (e, id:number) => {} 
}) => {
  let proposal: any = null;
  const isInactive = post?.status === 'inactive';
  if (isInactive) {
    proposal = post?.proposals.find(p => p.status === 'accepted');
  }
  return (
    <div className="post-item-client">
      <Link to={`/client/find/posts/${post?.id}`}>
        <div className="justify-content-between">
          <div className={isInactive ? "inactive-post" : ""}>
            <div className="d-flex">
              <div className="d-flex post-item-client__title text-ellipsis">
                {post?.title}
              </div>
              {post?.practice_area_data && (
               <Tag type="custom" isCustomContent={true} className="ml-2">
                 {post?.practice_area_data?.title}
               </Tag>
              )}
            </div>
            <div className="posted-date my-1">
              {post?.created
                ? "Posted " + format(new Date(post?.created), "MM/dd/yy")
                : ""}
            </div>
            {post?.budget_min && (
              <div className="post-item-client__budget mb-1">
                <b className="mr-05">Budget:</b>
                {renderBudget(post)}
              </div>
            )}
          </div>
          {isInactive ? (
            <div className="proposal-count">
              <div className="proposal-status">
                {proposal && proposal?.status_modified ? (
                  <div className="green-label-text px-2">
                    {`Proposal Accepted on ${format(new Date(proposal?.status_modified), "MM/dd/yy")}`}
                  </div>
                ) : !proposal && (
                  <div className="d-flex">
                    <Button 
                      widthFluid 
                      onClick={e => onReactivate(e, post.id)} 
                      className="mt-2"
                      type="outline"
                      >
                        Reactivate
                    </Button>
                  </div>
                )}
                <div className="inline-flex">
                  <Button 
                    widthFluid 
                    onClick={e => onDeletePost(e, post.id)} 
                    className="mt-2"
                    theme="white"
                    >
                      Delete Post
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="proposal-count">
              <img src={ProposalIcon} />
              {post?.proposals?.length} Proposals
            </div>
          )}
        </div>
        <div className="post-item-client__content mt-1">
          {post?.description}
        </div>
      </Link>
    </div>
  )
};
