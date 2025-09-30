import React, { useState, useEffect } from "react";
import classNames from "classnames";
import useOnclickOutside from "react-cool-onclickoutside";
import { Button, RiseLoader } from "components";
import CloseIcon from "assets/icons/close.svg";
import { deleteChat } from "api";

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
  onDelete?(): void;
  groupId: number;
}
export const DeleteChatModal = ({
  open,
  setOpen,
  onDelete = () => {},
  groupId,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const ref = useOnclickOutside(() => {
    setOpen(false);
  });

  const handleLeave = async () => {
    setIsLoading(true);
    await deleteChat(groupId);
    setIsLoading(false);
    setOpen(false);
    onDelete();
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
          <div className="title mb-4">{`Delete Chat`}</div>
          {isLoading ? (
            <RiseLoader className="my-4" />
          ) : (
            <>
              <div>{`Are you sure you want to delete this conversation permanently?`}</div>
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
                  onClick={handleLeave}
                >
                  Yes, Delete
                </Button>
              </div>{" "}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
