import React, {useState, useEffect, ReactNode} from "react";
import classNames from "classnames";
import useOnclickOutside from "react-cool-onclickoutside";
import {Button, RiseLoader} from "components";
import CloseIcon from "assets/icons/close.svg";

interface Props {
  open: boolean;

  setOpen(open: boolean): void;
  onDelete(): void;

  title?: string;
  message?: string;
  buttonCancelText?: string;
  buttonConfirmText?: string;
  containerClassName?: string;
  children?: ReactNode
}

export const DeleteConfirmationModal = ({
                                          open,
                                          setOpen,
                                          onDelete = () => {
                                          },
                                          title = "Delete Record",
                                          message = "Are you sure you want to delete this permanently?",
                                          buttonCancelText = "Cancel",
                                          buttonConfirmText = "Yes, Delete",
                                          containerClassName,
                                          children
                                        }: Props) => {

  const [isLoading, setIsLoading] = useState(false);

  const ref = useOnclickOutside(() => {
    setOpen(false);
  });

  const handleDelete = async () => {
    await setIsLoading(true);
    await onDelete();
    await setIsLoading(false);
    await setOpen(false);
  };

  useEffect(() => {
    if (open) {
      setIsLoading(false);
    }
    return () => {
    };
  }, [open]);

  return (
    <div className={classNames("alert-control-container", containerClassName, {open})}>
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
            <RiseLoader className="my-4"/>
          ) : (
            <>
              <div>{message}</div>
              {children}
              <div className="alert-control__footer mt-4">
                <Button
                  className="ml-auto"
                  onClick={() => setOpen(false)}
                  theme="white"
                >
                  {buttonCancelText}
                </Button>
                <Button
                  className="ml-3 mr-auto"
                  theme="red"
                  onClick={handleDelete}
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {buttonConfirmText}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
