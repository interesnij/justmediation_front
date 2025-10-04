import React from "react";
import { Modal, Button } from "components";
import { navigate } from "@reach/router";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
}
export const ApplicationReceiveModal = ({ open, setOpen }: Props) => {
  return (
    <Modal
      open={open}
      setOpen={(param) => {
        setOpen(param);
      }}
      disableOutsideClick
      disableClose
      title="Application Received"
      isTitleCenter
    >
      <div className="pb-4" style={{ width: 600 }}>
        <div className="text-black" style={{ fontSize: 18 }}>
          JustMediation has received your application.
        </div>
        <br />
        <div className="text-dark">
          The verification process of your application will take up to 5 days.
          Please check your inbox for an email from JustMediation to verify your email
          in the meantime. If your application is approved, our team will guide
          you to set up your account.
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
