import React, { useState } from "react";
import { Button } from "components";
import styled from "styled-components";
import PostMatterImg from "assets/icons/post_matter.svg";
import GetProposalsImg from "assets/icons/get_proposals.svg";
import AcceptHireImg from "assets/icons/accept_hire.svg";
import { RepPostMatterModal } from "modals";
import { useModal } from "hooks";

interface Props {
  onUpdate?(): void;
  isTopicsLoading?: boolean;
  topics?: any[]
  refetchPosts(): void;
}

export const MatterRepresentation = ({ 
  onUpdate = () => {},
  isTopicsLoading = true,
  topics = [],
  refetchPosts
}: Props) => {
  const [isMore, setIsMore] = useState(false);

  const postModal = useModal();
  const handleStarted = () => {
    postModal.setOpen(true);
  };
  const handleMore = () => {
    setIsMore(true);
  };

  return (
    <div>
      <div className="representation-page-container">
        <div className="title">Post Your Matter for Representation</div>
        <div className="desc">
          Match with attorneys that fit your legal needs. Compare prices, fees,
          proposals and attorney profiles.
        </div>
        {isMore && (
          <>
            <div className="mx-auto" style={{ width: "fit-content" }}>
              <div className="d-flex justify-content-center">
                <div className="representation-page--item">
                  <img src={PostMatterImg} alt="post matter" />
                  <div className="representation-page--item-title">
                    Post your Matter
                  </div>
                  <div className="representation-page--item-desc">
                    Get started by creating a post about your matter and legal
                    needs. Describe your legal issue and set a budget.
                  </div>
                </div>
                <div className="representation-page--item">
                  <img src={GetProposalsImg} alt="post matter" />
                  <div className="representation-page--item-title">
                    Get Proposals
                  </div>
                  <div className="representation-page--item-desc">
                    JustLaw matches you with attorneys most qualified to handle
                    your specific legal matter. Collect and compare prices,
                    fees, proposals, and profiles.
                  </div>
                </div>
                <div className="representation-page--item">
                  <img src={AcceptHireImg} alt="post matter" />
                  <div className="representation-page--item-title">
                    Accept and Hire your Attorney
                  </div>
                  <div className="representation-page--item-desc">
                    When you’re ready, accept their proposal and hire the
                    attorney that’s right for you.
                  </div>
                </div>
              </div>
              <div className="divider"></div>
            </div>
            <div
              className="text-black text-center mt-4"
              style={{ fontSize: 18 }}
            >
              Post your matter and have attorneys submit their proposals to you.
            </div>
          </>
        )}
        <div className="d-flex mt-2 justify-content-center">
          <Button onClick={handleStarted} size="large">
            {!isMore ? "Create New Post" : "Get Started"}
          </Button>
        </div>
        {!isMore && (
          <LearnMore className="mt-2" onClick={handleMore}>
            Learn More
          </LearnMore>
        )}
      </div>
      {
        postModal?.open &&
        <RepPostMatterModal 
          {...postModal } 
          isTopicsLoading={isTopicsLoading}
          topics={topics} 
          refetchPosts={refetchPosts}
        />
      }
    </div>
  );
};

const LearnMore = styled.div`
  color: rgba(0,0,0,.6);
  text-align: center;
  letter-spacing: -0.01em;
  font-family: "DM Sans";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
`;
