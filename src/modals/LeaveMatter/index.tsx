import React, { useState, useEffect } from "react";
import classNames from "classnames";
import useOnclickOutside from "react-cool-onclickoutside";
import { Button, RiseLoader } from "components";
import CloseIcon from "assets/icons/close.svg";
import { leaveMatter } from "api";

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
  onOk?(): void;
  matter?: string | number;
}
export const LeaveMatterModal = ({
  open,
  setOpen,
  matter,
  onOk = () => {},
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const ref = useOnclickOutside(() => {
    setOpen(false);
  });
  const handleLeave = async () => {
    setIsLoading(true);
    await leaveMatter(matter);
    onOk();
    setIsLoading(false);
    setOpen(false);
  };

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
          <div className="title">{`Leave Matter`}</div>
          {isLoading ? (
            <RiseLoader className="my-4" />
          ) : (
            <>
              <div className="mt-2 mb-4">{`Are you sure you want to leave it?`}</div>
              <div className="alert-control__footer">
                <Button
                  className="ml-auto"
                  onClick={() => setOpen(false)}
                  theme="white"
                >
                  Cancel
                </Button>
                <Button
                  className="ml-3 mr-auto"
                  onClick={handleLeave}
                  theme="red"
                >
                  Leave
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
