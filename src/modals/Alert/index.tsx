import React from "react";
import { Modal, Button } from "components";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  message?: string;
  title?: string;
}
export const AlertModal = ({
  open,
  setOpen,
  message,
  title = "Error",
}: Props) => {
  return (
    <Modal
      open={open}
      setOpen={(param) => {
        setOpen(param);
      }}
      disableOutsideClick
      disableClose
      title={title}
    >
      <div className="pb-4">
        <div className="text-black" style={{ fontSize: 18 }}>
          {message}
        </div>
        <br />
      </div>
      <div className="d-flex">
        <Button
          className="ml-auto"
          onClick={() => {
            setOpen(false);
          }}
        >
          Ok
        </Button>
      </div>
    </Modal>
  );
};
