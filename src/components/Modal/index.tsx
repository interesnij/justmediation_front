import React from "react";
import classNames from "classnames";
import styled from "styled-components";
import useOnclickOutside from "react-cool-onclickoutside";
import CloseIcon from "assets/icons/close.svg";
import BackArrowIcon from "assets/icons/arrow_back.svg";
import "./style.scss";
interface Props {
  open: boolean;
  setOpen(open: boolean): void;
  title?: string;
  subtitle?: string;
  headerIcon?: "leftArrow" | "";
  onHeaderIconClick?(): void;
  disableOutsideClick?: boolean;
  disableClose?: boolean;
  isTitleCenter?: boolean;
  children: React.ReactNode;
  modalWrapperClass?: string;
  modalClassName?: string;
}
export const Modal = ({
  open,
  title,
  subtitle = "",
  setOpen,
  disableOutsideClick = false,
  disableClose = false,
  children,
  onHeaderIconClick = () => {},
  headerIcon,
  isTitleCenter = false,
  modalClassName = "",
  modalWrapperClass = "",
}: Props) => {
  const ref = useOnclickOutside(() => {
    if (!disableOutsideClick) {
      setOpen(false);
    }
  });
  return (
    <div className={classNames("modal-control-container", modalClassName, { open })}>
      <div ref={ref} tabIndex={-1} className="modal-control">
        <div className="modal-control__header">
          {headerIcon === "leftArrow" ? (
            <Icon className="my-auto d-flex" onClick={onHeaderIconClick}>
              <img src={BackArrowIcon} className="my-auto mr-2" alt="back" />
            </Icon>
          ) : null}
          <div
            className={`my-auto title text-ellipsis w-100 ${
              isTitleCenter ? "text-center" : "text-left"
            }`}
          >
            {title}
            {!!subtitle && (
              <span className="subtitle-span">
                {subtitle}
              </span>
            )}
          </div>
          {!disableClose && (
            <img
              className="my-auto ml-auto close"
              src={CloseIcon}
              onClick={() => setOpen(false)}
              alt="close"
            />
          )}
        </div>
        <div className="modal-control__content ignore-onclickoutside">{children}</div>
      </div>
    </div>
  );
};

const Icon = styled.span`
  cursor: pointer;
  transition: all 300ms ease;
  &:hover {
    opacity: 0.7;
  }
`;
