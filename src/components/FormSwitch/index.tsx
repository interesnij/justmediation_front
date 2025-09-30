import React from "react";
import classNames from "classnames";
import "./style.scss";
import { nanoid } from "nanoid";
import { identity } from "lodash";

interface Props {
  className?: string;
  value?: boolean;
  label?: string;
  onChange?(param: boolean): void;
}

export const FormSwitch = ({
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
      <input type="checkbox" onChange={handleChange} id={id} checked={value} />
      <label htmlFor={id}>
        <span>{label}</span>
        <span></span>
      </label>
    </div>
  );
};
