import React from "react";
import classNames from "classnames";
import useOnclickOutside from "react-cool-onclickoutside";
import { Button } from "components";
import CloseIcon from "assets/icons/close.svg";
import "./style.scss";
interface Props {
  open: boolean;
  setOpen(open: boolean): void;
  title?: string;
  children: React.ReactNode;
  type?: "delete" | "archive" | "confirm";
  onOk?(): void;
}
export const Alert = ({
  open,
  title,
  setOpen,
  children,
  type = "confirm",
  onOk = () => {},
}: Props) => {
  const ref = useOnclickOutside(() => {
    setOpen(false);
  });
  const handleOk = () => {
    setOpen(false);
    onOk();
  };
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
          <div className="title">{title}</div>
          <div className="mt-2 mb-4">{children}</div>
          <div className="alert-control__footer">
            {type === "delete" ? (
              <>
                <Button
                  className="ml-auto"
                  onClick={() => setOpen(false)}
                  theme="white"
                >
                  Cancel
                </Button>
                <Button className="ml-3 mr-auto" onClick={handleOk} theme="red">
                  Delete
                </Button>
              </>
            ) : type === "archive" ? (
              <>
                <Button
                  className="ml-auto"
                  onClick={() => setOpen(false)}
                  theme="white"
                >
                  Cancel
                </Button>
                <Button
                  className="ml-3 mr-auto"
                  onClick={handleOk}
                  theme="green"
                >
                  Archive
                </Button>
              </>
            ) : type === "confirm" ? (
              <Button className="mx-auto" onClick={handleOk}>
                OK
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
