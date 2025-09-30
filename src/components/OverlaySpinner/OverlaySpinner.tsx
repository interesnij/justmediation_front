import React from "react";
import { RiseLoader } from "components";
import classNames from "classnames";
import "./style.scss";

interface Props {
  className?: string;
  isLoading: boolean;
}
export const OverlaySpinner = ({ 
  className,
  isLoading = false
}: Props) => {

  if (!isLoading)
      return null;

  return (
    <div className={classNames("overlay-spinner", className)}>
      <div>
        <RiseLoader className="my-4" />
      </div>
    </div>
  );
};
