import React from "react";
import { Modal, Button} from "components";
import "./style.scss";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  title?: string;
  message?: string;
  callback(): void;
}

export const SuccessModal = ({ title, open, setOpen, callback, message }: Props) => {

  return (
    <Modal open={open} setOpen={() => {
      open && callback();
      setOpen(false);
    }}
    modalClassName="modal-success"
    >
      <div className="modal-success-body">
        <div>
          <h1 className="title">{title}</h1>
        </div>
        {message && <div className="message mt-2 mb-4">
          {message}
        </div>}
        <Button
          className="mt-3"
          buttonType="button"
          size="large"
          onClick={() => {
            open && setOpen(false);
            callback();
          }}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};
