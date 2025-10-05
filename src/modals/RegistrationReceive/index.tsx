import React from "react";
import { Modal, Button } from "components";
import { navigate } from "@reach/router";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
}
export const RegistrationReceiveModal = ({ open, setOpen }: Props) => {
  return (
    <Modal
      open={open}
      setOpen={(param) => {
        setOpen(param);
      }}
      disableOutsideClick
      disableClose
      title="One more step"
      isTitleCenter
    >
      <div className="pb-4" style={{ width: 600 }}>
        <div className="text-black" style={{ fontSize: 18 }}>
          JustMediationHub has received your registration.
        </div>
        <br />
        <div className="text-dark">
            Please check your inbox for an email from JustMediationHub to verify your email address.
        </div>
      </div>
      <div className="d-flex mt-4">
        <Button
          className="ml-auto"
          onClick={() => {
            setOpen(false);
            navigate("/");
          }}
        >
          Return Home
        </Button>
      </div>
    </Modal>
  );
};
