import React, { useEffect, useState } from "react";
import { Modal, Button } from "components";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  error?: any;
  title?: string;
}
export const ErrorModal = ({
  open,
  setOpen,
  error,
  title = "Error",
}: Props) => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (open) {
      if (error?.response?.data?.message) {
        setMessage(error?.response?.data?.message);
      } else if (error?.response?.data?.detail) {
        setMessage(error?.response?.data?.detail);
      } else if (error?.data?.detail) {
        setMessage(error?.data?.detail)
      } else {
        setMessage(`${error?.response?.status} error occured`);
      }
    }
    return () => {};
  }, [open]);

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
          {/* {error?.response?.data?.data && (
            <ul>
              {Object.keys(error?.response?.data?.data).map((key, i) => (
                <li key={`${i}key`}>
                  {key} : {error?.response?.data?.data[key].join(", ")}
                </li>
              ))}
            </ul>
          )} */}
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
