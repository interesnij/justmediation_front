import React, { useState, useEffect } from "react";
import classNames from "classnames";
import useOnclickOutside from "react-cool-onclickoutside";
import { Button, RiseLoader } from "components";
import CloseIcon from "assets/icons/close.svg";

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
  onArchive?(): void;
}
export const ArchiveConfirmationModal = ({
  open,
  setOpen,
  onArchive = () => {}
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const ref = useOnclickOutside(() => {
    setOpen(false);
  });

  const handleArchive = async () => {
    setOpen(false);
    onArchive();
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
          <div className="title mb-4">{`Archive Chat`}</div>
          {isLoading ? (
            <RiseLoader className="my-4" />
          ) : (
            <>
              <div>{`Are you sure you want to archive this conversation?`}</div>
              <div className="alert-control__footer mt-4">
                <Button
                  className="ml-auto"
                  onClick={() => setOpen(false)}
                  theme="white"
                >
                  Cancel
                </Button>
                <Button
                  className="ml-3 mr-auto"
                  theme="red"
                  onClick={handleArchive}
                >
                  Ok
                </Button>
              </div>{" "}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
