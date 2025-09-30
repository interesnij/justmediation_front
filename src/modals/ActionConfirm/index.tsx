import React, { useState, useEffect } from "react";
import classNames from "classnames";
import useOnclickOutside from "react-cool-onclickoutside";
import { Button, RiseLoader } from "components";
import CloseIcon from "assets/icons/close.svg";
import "./style.scss";

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
  handleConfirm?(): void;
  title?: string;
  message?: string;
  confirmButton?: string;
  cancelButton?: string;
  loading?: boolean;
}
export const ActionConfirm =
  ({
     open,
     setOpen,
     handleConfirm = () => {},
     cancelButton = "Cancel",
     confirmButton = "Confirm",
     title = "",
     message = "",
     loading = false
  }: Props) => {

  const [isLoading, setIsLoading] = useState(loading);

  const ref = useOnclickOutside(() => {
    setOpen(false);
  });

  useEffect(() => {
    if (open) {
      setIsLoading(false);
    }
    return () => {};
  }, [open]);

  return (
    <div className={classNames("alert-control-container", { open })}>
      <div ref={ref} tabIndex={-1} className="alert-control">
        <div className="alert-control__header">
          <img
            className="my-auto ml-auto close"
            src={CloseIcon}
            onClick={() => setOpen(false)}
            alt="close"
          />
        </div>
        <div className="alert-control__content">
          <div className="title mb-4">{title}</div>
          {isLoading ? (
            <RiseLoader className="my-4" />
          ) : (
            <>
              <div>{message}</div>
              <div className="alert-control__footer mt-4">
                {cancelButton && <Button
                    className="ml-auto"
                    onClick={() => setOpen(false)}
                    theme="white"
                    disabled={loading}
                >
                  {cancelButton}
                </Button>}
                {confirmButton && <Button
                  className="ml-3 mr-auto"
                  theme="red"
                  onClick={() => handleConfirm()}
                  disabled={loading}
                  isLoading={loading}
                >
                  {confirmButton}
                </Button>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
