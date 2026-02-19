import React from "react";
import { Modal, Button } from "components";
import "./style.scss"
import { Link } from "@reach/router";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onConfirm?(): void;
  participants: any[];
  userId: number;
}

export const CallStartModal = ({ 
  open, 
  setOpen, 
  onConfirm = () => {}, 
  participants = [],
  userId
}: Props) => {
  
  const opponent: any = participants?.length ? participants.find(p => p?.id !== userId && p?.user_id !== userId) : {};

  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  }

  const name = opponent?.name || `${opponent?.first_name} ${opponent?.last_name}`;

  return (
    <Modal
      title="Start a Call"
      open={open}
      setOpen={setOpen}
    >
      <div className="start-call-modal">
        <div className="start-call-modal__title">
          Do you want to start a call with {name}?
        </div>
        
        <div className="d-flex mt-2">
          <Button
            buttonType="button"
            className="ml-auto"
            theme="white"
            size="large"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button> 
          <Link
            className="ml-3"
            to="//video.justmediationhub.com/"
            target={"_blank"}
            rel="noopener noreferrer"
            size="large"
          >
            Start Call
          </Link>
        </div>
      </div>
    </Modal>
  );
};