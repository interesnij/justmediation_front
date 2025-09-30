import React, { useState, useEffect } from "react";
import classNames from "classnames";
import WhiteCloseIcon from "assets/icons/close_white.svg";
import DarkCloseIcon from "assets/icons/close.svg";
import "./style.scss";
interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  title: string;
  children?: React.ReactNode;
  theme?: "green"|"white"|"grey";
  showNavBar?: boolean;
  noFooter?: boolean;
  className?: string;
}
export const FullScreenModal = ({ 
  open, 
  setOpen, 
  title, 
  children,
  theme = "grey",
  showNavBar = false,
  noFooter = false,
  className = '' 
}: Props) => {
  const [bgOpen, setBgOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setTimeout(() => setBgOpen(false), 300);
    } else {
      setBgOpen(true);
    }
    return () => {};
  }, [open]);

  return (
    <div
      tabIndex={0}
      className={classNames("full-modal__background", `${theme}-theme`, { open: bgOpen })}
    >
      <div className={classNames(`full-modal__container${showNavBar ? " with-visible-navbar" : ""}`, className, { open: open })}>
        <div className="full-modal__header">
          <span className="title my-auto">{title}</span>
          <img
            className="my-auto ml-auto close cursor-pointer"
            src={theme === 'grey' ? WhiteCloseIcon : DarkCloseIcon}
            onClick={() => setOpen(false)}
            alt="close"
          />
        </div>
        <div className={`full-modal__content${noFooter ? " with-no-footer" : ""}`}>{children}</div>
      </div>
    </div>
  );
};
interface FooterProps {
  children?: React.ReactNode;
}
export const FullScreenModalFooter = ({ children }: FooterProps) => {
  return <div className="full-modal__footer">{children}</div>;
};
