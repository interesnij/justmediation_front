import React from "react";
import classNames from "classnames";
import useOnclickOutside from "react-cool-onclickoutside";
import { Button } from "components";
import CloseIcon from "assets/icons/close.svg";

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
  onLeave?(): void;
}
export const LeavePageModal = ({
  open,
  setOpen,
  onLeave = () => {},
}: Props) => {
  const ref = useOnclickOutside(() => {
    setOpen(false);
  });

  const handleLeave = () => {
    setOpen(false);
    onLeave();
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
          <div className="title">{`Attention`}</div>

          <div className="mt-2">{`Are you sure you want to leave this page?`}</div>
          <div className="mt-2 mb-4">{`Your data wil be lost.`}</div>
          <div className="alert-control__footer">
            <Button
              className="ml-auto"
              onClick={() => setOpen(false)}
              theme="white"
            >
              Cancel
            </Button>
            <Button className="ml-3 mr-auto" theme="red" onClick={handleLeave}>
              Yes, leave
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};