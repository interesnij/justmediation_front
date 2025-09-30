import React, { useEffect } from "react";
import styled from "styled-components";
import { Modal, Button } from "components";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onConfirm(id: number): void;
  proposalId: number;
}
export const RevokeProposalModal = ({ open, setOpen, onConfirm, proposalId }: Props) => {
  let reset = () => {};

  useEffect(() => {
    if (open) {
    }
    return () => {};
  }, [open]);

  const handleConfirmation = () => {
    onConfirm(proposalId);
    setOpen(false);
  }

  return (
    <Modal
      title={"Revoke Proposal Acceptance"}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="new-post-modal">
        <Content>
          <div className="title mt-3">
            Are you sure you want to revoke your acceptance of this proposal?
          </div>
          <div className="mt-2">
            Revoking this proposal will reactivate your post and allow other
            attorneys to submit proposals on your matter. You can
            deactive/delete your post by clicking “Edit Post”.
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
            theme="red" 
            size="large"
            onClick={handleConfirmation}
          >
            Revoke
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
