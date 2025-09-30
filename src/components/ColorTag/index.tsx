import React from "react";
import classNames from "classnames";
import "./style.scss";

interface Props {
  className?: string;
  color?: string;
  value?: string;
  backgroundColor?: string;
  onClick?(): void;
}

export const ColorTag = ({
  color,
  backgroundColor,
  className,
  value = "",
  onClick = () => {},
}: Props) => {
  return (
    <div
      className={classNames("tag-control", className)}
      style={{ color, backgroundColor }}
      onClick={onClick}
    >
      {value ? value?.toUpperCase() : ""}
    </div>
  );
};
