import React from "react";
import CloseImg from "assets/icons/close_white.svg";
import { Button } from "components";
import classNames from "classnames";
import "./style.scss";

interface Props {
  title: string;
  children?: React.ReactNode;
  onSave?(): void;
  onClose?(): void;
  withFooter?: boolean;
  contentTheme?: string;
}
export const FullScreen = ({
  title,
  children,
  onSave = () => {},
  onClose = () => {},
  withFooter = true,
  contentTheme = "primary",
}: Props) => {
  return (
    <div className="fullscreen">
      <div className="fullscreen__header">
        <span className="my-auto">{title}</span>
        <img src={CloseImg} alt="close" onClick={onClose} />
      </div>
      <div
        className={classNames("fullscreen__content d-flex flex-column", {
          [`fullscreen__content--${contentTheme}`]: contentTheme,
        })}
      >
        {children}
      </div>
      {withFooter && (
        <div className="fullscreen__footer">
          <span className="mr-3 my-auto" onClick={onClose}>
            Cancel
          </span>
          <Button theme="yellow" className="my-auto" onClick={onSave}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};
