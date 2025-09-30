import React, { useState, useEffect } from "react";
import classNames from "classnames";
import useOnclickOutside from "react-cool-onclickoutside";
import { Button, RiseLoader } from "components";
import CloseIcon from "assets/icons/close.svg";
import { deleteMatter } from "api";

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
  onOk?(): void;
  matter?: string | number;
}
export const DeleteMatterModal = ({
  open,
  setOpen,
  matter,
  onOk = () => {},
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const ref = useOnclickOutside(() => {
    setOpen(false);
  });
  const handleDelete = async () => {
    setIsLoading(true);
    await deleteMatter(matter);
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
          <div className="title">{`Delete Matter`}</div>

          {isLoading ? (
            <RiseLoader className="my-4" />
          ) : (
            <>
              <div className="mt-2 mb-4">{`Are you sure you want to delete it permanently?`}</div>
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
                  onClick={handleDelete}
                  theme="red"
                >
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
