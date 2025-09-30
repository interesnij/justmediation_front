import React, { useState, useEffect } from "react";
import classNames from "classnames";
import CloseIcon from "assets/icons/close.svg";
import useOnclickOutside from "react-cool-onclickoutside";
import "./style.scss";
interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  title: string;
  children?: React.ReactNode;
  size?: "small" | "normal" | "large";
  disableOutsideClick? : boolean;
}
export const SideModal = ({
  open,
  setOpen,
  title,
  children,
  size = "normal",
  disableOutsideClick = false,
}: Props) => {
  const [bgOpen, setBgOpen] = useState(false);
  const ref = useOnclickOutside(() => {
    if (!disableOutsideClick) setOpen(false);
  });
  useEffect(() => {
    if (!open) {
      setTimeout(() => setBgOpen(false), size === "normal" ? 600 : 300);
    } else {
      setBgOpen(true);
    }
    return () => {};
  }, [open, size]);
  return (
    <div
      tabIndex={-1}
      className={classNames("side-modal__background", { open: bgOpen })}
    >
      <div
        ref={ref}
        className={classNames("side-modal__container", { open: open }, size)}
      >
        <div className="side-modal__header">
          <span className="title">{title}</span>
          <img
            src={CloseIcon}
            className="close-button"
            alt="close"
            onClick={() => setOpen(false)}
          />
        </div>
        <div className="side-modal__content d-flex flex-column">{children}</div>
      </div>
    </div>
  );
};
