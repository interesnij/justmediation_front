import React from "react";
import styled from "styled-components";
import { Modal, Button } from "components";
import { navigate } from "@reach/router";
import { withdrawProposal } from "api";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  proposal?: any;
  userType: string;
}
export const WithdrawProposal = ({ open, setOpen, proposal, userType }: Props) => {

  const handleWithdraw = async () => {
    try {
      await withdrawProposal(proposal?.id);
      navigate(`/${userType}/engagement/submitted`);
    } catch (error: any) {
      console.log(error?.response?.message || error?.response?.data?.detail);
    }
  }

  return (
    <Modal
      title={"Withdraw Proposal"}
      open={open}
      setOpen={(param) => {
        setOpen(param);
      }}
    >
      <div className="new-post-modal">
        <Content>
          <div className="title mt-3">
            Are you sure you want to withdraw your proposal from this potential
            engagement?
          </div>
          <div className="mt-2">
            You will lose all details of your proposal and it will be removed
            from your submitted engagements.
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
          <Button className="ml-3" onClick={handleWithdraw} theme="red" size="large">
            Withdraw
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
