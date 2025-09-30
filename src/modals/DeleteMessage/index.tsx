import React, { useState, useEffect } from "react";
import classNames from "classnames";
import useOnclickOutside from "react-cool-onclickoutside";
import { Button, RiseLoader } from "components";
import CloseIcon from "assets/icons/close.svg";
import { deleteMatterTopic } from "api";

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
  onDelete?(): void;
  id: number;
}
export const DeleteMessageModal = ({
  open,
  setOpen,
  onDelete = () => {},
  id,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const ref = useOnclickOutside(() => {
    setOpen(false);
  });

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteMatterTopic(id);
    setOpen(false);
    setIsLoading(false);
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
          <div className="title mb-4">{`Delete Message`}</div>
          {isLoading ? (
            <RiseLoader className="my-4" />
          ) : (
            <>
              <div>{`Are you sure you want to delete this message permanently?`}</div>
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
                  onClick={handleDelete}
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
