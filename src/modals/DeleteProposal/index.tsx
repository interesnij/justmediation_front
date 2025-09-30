import React from "react";
import styled from "styled-components";
import { Modal, Button } from "components";
import { deleteProposal } from "api";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  proposal?: any;
  callback(): void;
}
export const DeleteProposal = ({ open, setOpen, proposal, callback }: Props) => {

  const handleDelete = async () => {
    try {
      await deleteProposal(proposal?.id);
      if (callback) callback();
    } catch (error: any) {
      console.log(error?.response?.message || error?.response?.data?.detail);
    }
    setOpen(false)
  }

  return (
    <Modal
      title={"Delete Proposal"}
      open={open}
      setOpen={(param) => {
        setOpen(param);
      }}
    >
      <div className="new-post-modal">
        <Content>
          <div className="title mt-3">
            Are you sure you want to delete your proposal record?
          </div>
        </Content>
        <div className="d-flex mt-3">
          <Button
            buttonType="button"
            className="ml-auto"
            theme="white"
            size="large"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button className="ml-3" onClick={handleDelete} theme="red" size="large">
            Delete
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
