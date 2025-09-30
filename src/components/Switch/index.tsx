import React from "react";
import classNames from "classnames";
import { nanoid } from "nanoid";

interface Props {
  className?: string;
  value?: boolean;
  label?: string;
  onChange?(param: boolean): void;
}

export const Switch = ({
  className,
  label,
  value = false,
  onChange = () => {},
}: Props) => {
  const id = nanoid();
  const handleChange = () => {
    onChange(!value);
  };
  return (
    <div className={classNames("switch-control", className)}>
      <input id={id} type="checkbox" onChange={handleChange} checked={value} />
      <label htmlFor={id}>
        <span>{label}</span>
        <span></span>
      </label>
    </div>
  );
};
