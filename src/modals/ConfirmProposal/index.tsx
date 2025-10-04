import React, { useEffect } from "react";
import styled from "styled-components";
import { Modal, Button } from "components";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onAccept(id: number): void;
  proposalId: number;
}
export const ConfirmProposalModal = ({ open, setOpen, onAccept, proposalId }: Props) => {
  let reset = () => {};

  useEffect(() => {
    if (open) {
    }
    return () => {};
  }, [open]);

  const handleConfirmation = () => {
    onAccept(proposalId);
    setOpen(false);
  }

  return (
    <Modal
      title={"Confirm Proposal Acceptance"}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="new-post-modal">
        <Content>
          <div className="title mt-3">
            Are you sure you want to choose this mediator and accept this
            proposal?
          </div>
          <div className="mt-2">
            Acceptance of a proposal will deactive all other bids. If you would
            like to change your mind, you may do so before any agreement happens
            between you and the mediator.
          </div>
        </Content>
        <div className="d-flex mt-3">
          <Button
            buttonType="button"
            className="ml-auto"
            theme="white"
            size="large"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button 
            className="ml-3" 
            buttonType="submit" 
            size="large"
            onClick={handleConfirmation}
          >
            Accept
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const Content = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 26px;
  letter-spacing: -0.01em;
  color: #2e2e2e;

  .title {
    font-weight: 500;
    font-size: 18px;
    line-height: 23px;
    letter-spacing: -0.01em;
    color: #000000;
  }
`;
